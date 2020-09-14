import React, {
  memo, useMemo, useRef, useState, useEffect,
} from 'react'
import PropTypes from 'prop-types'

// Generic hook for detecting scroll:
const useScrollAware = () => {
  const [scrollTop, setScrollTop] = useState(0)
  const ref = useRef()

  const onScroll = (e) => requestAnimationFrame(() => {
    setScrollTop(e.target.scrollTop)
  })

  useEffect(() => {
    const scrollContainer = ref.current

    setScrollTop(scrollContainer.scrollTop)
    scrollContainer.addEventListener('scroll', onScroll)
    return () => scrollContainer.removeEventListener('scroll', onScroll)
  }, [])

  return [scrollTop, ref]
}

// VirtualScroll component
const VirtualScroll = ({
  Item,
  itemCount,
  height,
  childHeight,
  renderAhead = 20,
}) => {
  const [scrollTop, ref] = useScrollAware()
  const totalHeight = itemCount * childHeight

  let startNode = Math.floor(scrollTop / childHeight) - renderAhead
  startNode = Math.max(0, startNode)

  let visibleNodeCount = Math.ceil(height / childHeight) + 2 * renderAhead
  visibleNodeCount = Math.min(itemCount - startNode, visibleNodeCount)

  // fixes 'Invalid Array Length' error
  visibleNodeCount = Math.max(0, visibleNodeCount)
  visibleNodeCount = Math.min(32 ** 2 - 1, visibleNodeCount)

  const offsetY = startNode * childHeight

  const visibleChildren = useMemo(
    () => new Array(visibleNodeCount)
      .fill(null)
      .map((_, index) => (
        <Item key={index.toString() + startNode} index={index + startNode} />
      )),
    [startNode, visibleNodeCount],
  )

  return (
    <div style={{ height, overflow: 'auto' }} ref={ref}>
      <div
        className="viewport"
        style={{
          overflow: 'hidden',
          willChange: 'transform',
          height: totalHeight,
          position: 'relative',
        }}
      >
        <div
          style={{
            willChange: 'transform',
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleChildren}
        </div>
      </div>
    </div>
  )
}

VirtualScroll.defaultProps = {
  renderAhead: undefined,
}

VirtualScroll.propTypes = {
  Item: PropTypes.instanceOf(Object).isRequired,
  itemCount: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  childHeight: PropTypes.number.isRequired,
  renderAhead: PropTypes.number,
}

export default memo(VirtualScroll)
