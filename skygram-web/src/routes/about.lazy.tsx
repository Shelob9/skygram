import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  return <article className="prose">
    <h2 className="my-8">About Skygram</h2>
    <p>Photo-centric client for <a href="bsky.app"
      target="_blank" rel="noopener noreferrer">Bluesky</a>.

    </p>
    <ul>

        <li>
          A work in progress by <a href="https://bsky.app/profile/josh412.com"
        target="_blank" rel="noopener noreferrer">
          Josh Pollock
          </a>
        </li>
        <li>
          This website is<a href="https://github.com/shelob9/skygram"
        target="_blank" rel="noopener noreferrer">
          open source</a>
        </li>
    </ul>
  </article>
}
