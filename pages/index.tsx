import { supabase } from '../utils/supabase'
import Link from 'next/link'
import { useUser } from '../context/user'

export default function Home({ lessons }) {
  const { user } = useUser()
  console.log({ user })
  return (
    <div className="mx-auto my-16 w-full max-w-3xl px-2">
      <div>
        <Link href="/login">
          <a>Login</a>
        </Link>
        <Link href="/logout">
          <a>Logout</a>
        </Link>
      </div>
      {lessons.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`}>
          <a className="mb-4 flex h-40 rounded p-8 text-xl shadow">
            {lesson.title}
          </a>
        </Link>
      ))}
    </div>
  )
}

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from('lesson').select('*')

  return {
    props: {
      lessons,
    },
  }
}
