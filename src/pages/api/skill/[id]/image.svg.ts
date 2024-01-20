import type { APIContext } from 'astro'
import { SKILLS } from '@/library/notion'

export async function GET ({ params }: APIContext) {
  const { id } = params
  const skill = SKILLS.find(f => f.id === id)

  if (skill === undefined) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    })
  }

  if (skill.icon === null) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    })
  }

  const response = await fetch(skill.icon.url)
  const svg = await response.text()

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  })
}

export function getStaticPaths () {
  return SKILLS.map(s => ({ params: { id: s.id } }))
}
