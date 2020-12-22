import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Scrollbars } from 'react-custom-scrollbars'

import api from '~base/api'
import { error } from '~base/components/toast'

const labels = {
  male: 'Hombres',
  female: 'Mujeres'
}

const GenderByYearBars = () => {
  const vis = useRef(null)
  const [data, setData] = useState([])

  const height = 300
  const width = 3000

  // Get series from api
  const getData = async () => {
    try {
      const years = await api.get('/datasets/gender-years')
      setData(years)
    } catch (err) {
      error()
    }
  }

  // Draw visualization
  const draw = () => {
    const container = d3.select(vis.current)
    const svg = container.append('svg')
      .attr('viewBox', [0, 0, width, height])
      .attr('width', width).attr('height', height)

    const margin = {top: 10, right: 10, bottom: 20, left: 40}

    const series = d3.stack().keys(['male', 'female'])(data).map(d => (d.forEach(v => { v.key = d.key }), d))

    const x = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const y = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .rangeRound([height - margin.bottom, margin.top])

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const xAxis = g => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call(g => g.selectAll('.domain').remove())

    const yAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, 's'))
      .call(g => g.selectAll('.domain').remove())

    const tooltip = d3.select('.vis-tooltip-container').append('div').attr('class', 'vis-tooltip').style('opacity', 0)

    svg.append('g')
      .selectAll('g')
      .data(series)
      .enter()
      .append('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', (d, i) => x(d.data.year))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth())
      .on('mouseout', () => {
        tooltip
          .transition()
          .duration(300)
          .style('opacity', 0)
      })
      .on('mousemove', function (d) {
        const value = d[1] - d[0]
        const key = ['male', 'female'].find(key => d.data[key] === value)
        const label = labels[key]

        const [xPos, yPos] = d3.mouse(this)

        tooltip
          .transition()
          .duration(300)
          .style('opacity', 1)

        tooltip
          .html(`${label}: ${value}`)
          .style('transform', `translate(${xPos + 15}px,${yPos}px)`)
      })

    svg.append('g')
      .call(xAxis)

    svg.append('g')
      .call(yAxis)
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (vis && data.length) {
      draw()
    }
  }, [vis, data])

  return (
    <Scrollbars autoHide={false} style={{ height: 320, position: 'relative' }}>
      <div ref={vis} style={{ position: 'absolute', right: 0, left: 0, top: 0, bottom: 0 }} />
      <div className='vis-tooltip-container' />
    </Scrollbars>
  )
}

export default GenderByYearBars
