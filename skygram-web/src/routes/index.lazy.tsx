import { createLazyFileRoute } from '@tanstack/react-router'
import Feed from '../Skygram/Feed'

export const Route = createLazyFileRoute('/')({
  component: Feed,
})
