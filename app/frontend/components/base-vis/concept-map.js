import React, { Component } from 'react'
import * as d3 from 'd3'

class ConceptMap extends Component {
  getData () {
    const { dataset } = this.props

    let outer = d3.map()
    let inner = []
    let links = []

    let outerId = [0]

    dataset.forEach(d => {
      if (d) {
        let i = { id: 'i' + inner.length, name: d[0], relatedLinks: [] }
        i.relatedNodes = [i.id]
        inner.push(i)

        d[1].forEach(d1 => {
          let o = outer.get(d1)
          if (!o) {
            o = { name: d1, id: 'o' + outerId[0], relatedLinks: [] }
            o.relatedNodes = [o.id]
            outerId[0] = outerId[0] + 1
            outer.set(d1, o)
          }

          let l = { id: 'l-' + i.id + '-' + o.id, inner: i, outer: o }
          links.push(l)

          i.relatedNodes.push(o.id)
          i.relatedLinks.push(l.id)
          o.relatedNodes.push(i.id)
          o.relatedLinks.push(l.id)
        })
      }
    })

    const data = { inner, outer: outer.values(), links }
    outer = data.outer
    data.outer = Array(outer.length)

    let i1 = 0
    let i2 = outer.length - 1

    for (let i = 0; i < data.outer.length; ++i) {
      if (i % 2) {
        data.outer[i2--] = outer[i]
      } else {
        data.outer[i1++] = outer[i]
      }
    }

    return data
  }

  createVisualization () {
    const node = this.refs.svg
    const data = this.getData()
    const {
      width,
      height,
      rectWidth,
      rectHeight
    } = this.props

    const innerY = d3.scaleLinear()
      .domain([0, data.inner.length])
      .range([-(data.inner.length * rectHeight) / 2, (data.inner.length * rectHeight) / 2])

    const outerX = d3.scaleLinear()
      .domain([0, (data.outer.length / 2.0), (data.outer.length / 2.0), data.outer.length])
      .range([22, 160, 202, 340])

    data.outer = data.outer.map((d, i) => {
      d.x = outerX(i)
      d.y = width / 3
      return d
    })

    data.inner = data.inner.map((d, i) => {
      d.x = -(rectWidth / 2)
      d.y = innerY(i)
      return d
    })

    const diagonal = d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x)
      .source(d => ({
        x: d.outer.y * Math.cos(projectX(d.outer.x)),
        y: -d.outer.y * Math.sin(projectX(d.outer.x))
      }))
      .target(d => ({
        x: d.inner.y + rectHeight / 2,
        y: d.outer.x > 180 ? d.inner.x : d.inner.x + rectWidth
      }))

    const svg = d3.select(node)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    svg.append('g').attr('class', 'links').selectAll('.link')
      .data(data.links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('id', d => d.id)
      .attr('d', diagonal)

    const onode = svg.append('g').selectAll('.outer_node')
      .data(data.outer)
      .enter().append('g')
      .attr('class', 'outer_node')
      .attr('transform', d => 'rotate(' + (d.x - 90) + ') translate(' + d.y + ')')
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)

    onode.append('circle')
      .attr('id', d => d.id)
      .attr('r', 4.5)
      .append('circle')
      .attr('r', 20)
      .attr('visibility', 'hidden')

    onode.append('text')
      .attr('id', d => d.id + '-txt')
      .attr('dy', '0.3em')
      .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
      .attr('transform', d => d.x < 180 ? 'translate(9)' : 'rotate(180) translate(-9)')
      .text(d => d.name)

    const inode = svg.append('g').selectAll('.inner_node')
      .data(data.inner)
      .enter().append('g')
      .attr('class', 'inner_node')
      .attr('transform', d => 'translate(' + d.x + ',' + (d.y + 1) + ')')
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)

    inode.append('rect')
      .attr('width', rectWidth)
      .attr('height', rectHeight + 1)
      .attr('id', d => d.id)

    inode.append('text')
      .attr('id', d => d.id + '-txt')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(' + rectWidth / 2 + ', ' + rectHeight * 0.75 + ')')
      .text(d => d.name)
  }

  componentDidMount () {
    this.createVisualization()
  }

  componentDidUpdate () {
    const node = this.refs.svg
    d3.select(node).select('g').remove()
    this.createVisualization()
  }

  render () {
    const { width, height } = this.props
    return <svg
      ref='svg'
      className='is-dataviz is-dataviz-concept-map'
      viewBox={`0 0 ${width} ${height}`}
      width='100%'
      height='100%'
      preserveAspectRatio='xMinYMin meet'
    />
  }
}

function projectX (x) {
  return ((x - 90) / 180 * Math.PI) - (Math.PI / 2)
}

function mouseover (d) {
  d3.selectAll('.links .link').sort((a, b) => d.relatedLinks.indexOf(a.id))

  for (let i = 0; i < d.relatedNodes.length; i++) {
    d3.select('#' + d.relatedNodes[i]).classed('highlight', true)
  }

  for (var i = 0; i < d.relatedLinks.length; i++) {
    d3.select('#' + d.relatedLinks[i]).classed('is-highlight-link', true)
  }
}

function mouseout (d) {
  d3.selectAll('.highlight').classed('highlight', false)
  d3.selectAll('.is-highlight-link').classed('is-highlight-link', false)
}

ConceptMap.defaultProps = {
  width: 1000,
  height: 770,
  rectWidth: 200,
  rectHeight: 13
}

export default ConceptMap
