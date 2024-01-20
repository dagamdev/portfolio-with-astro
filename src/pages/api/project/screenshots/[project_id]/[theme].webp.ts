import type { APIContext } from 'astro'
import { PROJECTS } from '../../../../../library/notion'

export async function GET ({ params, request }: APIContext) {
  const { project_id: projectId, theme } = params
  const project = PROJECTS.find(p => p.id === projectId)

  if (project === undefined) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    })
  }

  const screenshotUrl = project.screenshots[+(theme === 'dark')]?.url ?? project.screenshots[0].url

  const response = await fetch(screenshotUrl)
  const buffer = Buffer.from(await response.arrayBuffer())

  return new Response(buffer, {
    headers: { 'Content-Type': 'image/webp' }
  })
}

export function getStaticPaths () {
  return PROJECTS.map(p => {
    return [
      { params: { project_id: p.id, theme: 'light' } },
      { params: { project_id: p.id, theme: 'dark' } }
    ]
  }).flat()
}
