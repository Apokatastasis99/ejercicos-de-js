import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Scrollbars } from 'react-custom-scrollbars'

import api from '~base/api'
import Loader from '~base/components/spinner'
import { error } from '~base/components/toast'

import './styles.scss'

const DegreeTrendChart = () => {
  const vis = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])

  const height = 300
  const width = 700

  const getData = async () => {
    try {
      const years = await api.get('/datasets/degrees-years')
      setData(years)
    } catch (err) {
      error()
    }
    setIsLoading(false)
  }

  const draw = () => {
    const container = d3.select(vis.current)
    const svg = container.append('svg')
      .attr('viewBox', [0, 0, width, height])
      .attr('width', width).attr('height', height)

    const margin = { top: 20, right: 20, bottom: 0, left: 40 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom
    const legendWidth = width - 120
    const legendHeight = 90

    const x = d3.scaleTime()
      .range([0, chartWidth])
      .domain(d3.extent(data, (d) => new Date(`${d.year}-01-01`)))

    const y = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, d3.max(data, (d) => d.bachelor + d.master + d.doctorate)])

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)')

    legend.append('rect')
      .attr('class', 'legend-bg')
      .attr('width', legendWidth)
      .attr('height', legendHeight)

    legend.append('rect')
      .attr('class', 'f2')
      .attr('width', 50)
      .attr('height', 15)
      .attr('x', 10)
      .attr('y', 13)
    legend.append('text')
      .attr('x', 67)
      .attr('y', 25)
      .text('Doctorado')

    legend.append('rect')
      .attr('class', 'f1')
      .attr('width', 50)
      .attr('height', 15)
      .attr('x', 10)
      .attr('y', 33)
    legend.append('text')
      .attr('x', 67)
      .attr('y', 45)
      .text('Maestría')

    legend.append('rect')
      .attr('class', 'f0')
      .attr('width', 50)
      .attr('height', 15)
      .attr('x', 10)
      .attr('y', 53)
    legend.append('text')
      .attr('x', 67)
      .attr('y', 65)
      .text('Licenciatura')

    legend.append('path')
      .attr('class', 'median-line')
      .attr('d', 'M10,80L60,80')
    legend.append('text')
      .attr('x', 67)
      .attr('y', 85)
      .attr('font-weight', 'bold')
      .text('Media')

    const xAxis = d3.axisBottom(x)
      .tickSizeInner(-chartHeight)
      .tickSizeOuter(0)
      .tickPadding(10)
      .tickFormat(d3.timeFormat('%Y'))

    const yAxis = d3.axisLeft(y)
      .tickSizeInner(-chartWidth)
      .tickSizeOuter(0)
      .tickPadding(10)

    const axes = svg.append('g')
      .attr('clip-path', 'url(#axes-clip)')

    axes.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${margin.left},${chartHeight})`)
      .call(xAxis)

    axes.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Tesis')

    const f0 = d3.area()
      .curve(d3.curveBasis)
      .x((d) => x(new Date(`${d.year}-01-01`)))
      .y0((d) => y(0))
      .y1((d) => y(d.bachelor))

    const f1 = d3.area()
      .curve(d3.curveBasis)
      .x((d) => x(new Date(`${d.year}-01-01`)))
      .y0((d) => y(d.bachelor))
      .y1((d) => y(d.bachelor + d.master))

    const f2 = d3.area()
      .curve(d3.curveBasis)
      .x((d) => x(new Date(`${d.year}-01-01`)))
      .y0((d) => y(d.bachelor + d.master))
      .y1((d) => y(d.bachelor + d.master + d.doctorate))

    const medianLine = d3.line()
      .curve(d3.curveBasis)
      .x((d) => x(new Date(`${d.year}-01-01`)))
      .y((d) => y((d.bachelor + d.master + d.doctorate) / 3))

    svg.append('path')
      .attr('class', 'area upper f0')
      .attr('transform', `translate(${margin.left},0)`)
      .attr('d', f0(data))
      .attr('clip-path', 'url(#rect-clip)')

    svg.append('path')
      .attr('class', 'area upper f1')
      .attr('transform', `translate(${margin.left},0)`)
      .attr('d', f1(data))
      .attr('clip-path', 'url(#rect-clip)')

    svg.append('path')
      .attr('class', 'area upper f2')
      .attr('transform', `translate(${margin.left},0)`)
      .attr('d', f2(data))
      .attr('clip-path', 'url(#rect-clip)')

    svg.append('path')
      .attr('class', 'median-line')
      .attr('transform', `translate(${margin.left},0)`)
      .attr('d', medianLine(data))
      .attr('clip-path', 'url(#rect-clip)')
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
      {isLoading && <Loader />}
    </Scrollbars>
  )
}

export default DegreeTrendChart
