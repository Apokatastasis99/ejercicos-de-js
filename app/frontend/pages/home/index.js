import React from 'react'
import Page from '~base/page'
import Stats from '~components/Stats'
import GenderByYearBars from '../../components/base-vis/GenderByYearBars'

const Home = () => {
  return (
    <div className='container is-fluid mt-6'>
      <div className='columns is-variable is-6'>
        <div className='column'>
          <div className='content'>
            <h2>Acerca</h2>
            <p>
              El proyecto PlFFyL 01_004_2019 <strong>Genealogía digital de la producción de discurso en los trabajos recepcionales de filosofía de la UNAM </strong>
              (<a href='https://twitter.com/search?q=%23TesisFilosUNAM&src=typed_query&f=live'>#TesisFilosUNAM</a>)
              del <a href='http://stf.filos.unam.mx/'>#SeminarioTF</a>, de la <a href='http://www.filos.unam.mx/'>Facultad de Filosofía y Letras</a> de
              la UNAM, busca comenzar una genealogía de la producción de discurso en
              los trabajos recepcionales de filosofía elaborados en la UNAM de 1928 a 2017,
              con los datos de la <a href='http://dgb.unam.mx/'>Dirección General de Bibliotecas</a>.
              El proyecto pretende generar herramientas para conocer la historia reciente
              del ejercicio de la filosofía en la UNAM, generar discusiones teóricas sobre
              el tipo de discurso que usamos los filósofos de la UNAM, y abrir una línea de
              investigación de historia de la filosofía en México usando tecnología digital.
              Pero también podría tener aplicación en procesos de toma de decisiones en la
              gestión administrativa-académica.
            </p>
            <p>
              La motivación de este proyecto ha sido experimentar con la relación entre
              las potencias de las tecnologías digitales y el ejercicio conceptual de
              la filosofía para discutir las formas de transmisión del ejercicio de lo
              filosófico en México. También se ha buscado discutir y aplicar las metodologías
              empleadas en las Humanidades Digitales para discutir la configuración actual de
              la investigación filosófica académica.
            </p>

            <h4>Objetivos</h4>
            <ul>
              <li>Generar una herramienta digital para el análisis digital de datos sobre la producción de discursos filosófico en la UNAM.</li>
              <li>Generar un grupo de debate sobre la relación entre tecnología y ejercicio de la filosofía.</li>
              <li>Experimentar con la generación de metodologías y herramientas digitales para el análisis de datos sobre la producción de discurso filosófico en la UNAM.</li>
              <li>Conocer la trayectoria histórica de la producción de discurso filosófico en la UNAM.</li>
              <li>Registrar tendencias en la producción de discurso filosófico en la UNAM.</li>
              <li>Establecer relaciones de producción de discurso en la licenciatura con los programas de posgrado de la UNAM.</li>
              <li>Identificar las relaciones existentes entre la producción de la filosofía en la UNAM y la filosofía en otro países.</li>
              <li>Generar una metodología de trabajo que sea posible replicar en otras instituciones y en relación con otros saberes</li>
            </ul>
          </div>
        </div>
        <div className='column'>
          <div className='box'>
            <h4 className='has-text-centered mb-3'>Por años y género</h4>
            <GenderByYearBars />
          </div>
        </div>
      </div>

      <Stats />
    </div>
  )
}

export default Page({
  path: '/',
  title: 'Acerca',
  exact: true,
  component: Home
})
