

import type { VirtualizerOptions } from '@tanstack/react-virtual'
import { elementScroll, useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useRef } from 'react'

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
}

export default function Virtual({count,Item}:{
  count: number
  Item: (props: {index: number}) => JSX.Element
}) {
  const parentRef = useRef<HTMLDivElement>(null)
  const scrollingRef =useRef<number>()

  const scrollToFn: VirtualizerOptions<any, any>['scrollToFn'] =
   useCallback((offset, canSmooth, instance) => {
      const duration = 1000
      const start = parentRef.current?.scrollTop || 0
      const startTime = (scrollingRef.current = Date.now())

      const run = () => {
        if (scrollingRef.current !== startTime) return
        const now = Date.now()
        const elapsed = now - startTime
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1))
        const interpolated = start + (offset - start) * progress

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance)
          requestAnimationFrame(run)
        } else {
          elementScroll(interpolated, canSmooth, instance)
        }
      }

      requestAnimationFrame(run)
    }, [])

  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
    scrollToFn,
  })


  return (
    <div>
      <div
        ref={parentRef}
        className="w-full overflow-auto"
      >
        <div

        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}

            >
              <Item index={virtualRow.index} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
