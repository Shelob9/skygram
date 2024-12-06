import { createLazyFileRoute } from '@tanstack/react-router';
import FeedGen from '../Skygram/FeedGen';

export const Route = createLazyFileRoute('/feedgen')({
  component: FeedGen,
})
