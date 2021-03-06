import initStripe from 'stripe'
import { buffer } from 'micro'
import { supabase, getServiceSupabase } from '../../utils/supabase'

export const config = { api: { bodyParser: false } }

const handler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY)
  const signature = req.headers['stripe-signature']
  const signingSecret = initStripe(process.env.STRIPE_SIGNING_SECRET)
  const reqBuffer = await buffer(req)

  let event

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret)
  } catch (error) {
    console.log(error)
    return res.status(400).send(`Webhook error: ${error.message}`)
  }

  const supabase = getServiceSupabase()

  switch (event.type) {
    case 'customer.subscription.created':
      await supabase
        .from('profile')
        .update({
          is_subscribed: true,
          interval: event.data.object.items.data[0].plan.interval,
        })
        .eq('stripe_customer')
  }

  console.log({ event })

  res.send({ recieved: true })
}

export default handler
