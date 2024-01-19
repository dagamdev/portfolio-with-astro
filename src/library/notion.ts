import { Client } from '@notionhq/client'
import type { TextData, SkillData, ProjectData } from '../types'

const DATABASE_IDS = {
  TEXTOS: 'f3edab349ad548a29d66d6214ab0d2d0',
  SKILLS: '8b69fd4728ea47009da48b5c6543f930',
  PROJECTS: '5eec4776e06640adbf8188b730c13297'
}

export const NotionClient = new Client({auth: import.meta.env.NOTION_TOKEN})

interface PropertyData {
  type: string;
  [key: string]: PropertyData | any;
}

function propertyUtils(properties: any) {
  return {
    getValue <T = any> (data: PropertyData | string): T {
      let property = data as PropertyData | undefined
      if (typeof data == 'string') {
        property = properties?.[data]
      }
  
      const value = property?.[property?.type]
      if (value?.type) {
        return this.getValue(value)
      }
  
      return value
    }
  }
}

function transformMessageData(messageData: {
  type: string
  text: {
    content: string
    link: string | null
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  plain_text: string 
  href: string | null
}[]) {
  return messageData.map(m => ({
    link: m.href,
    content: m.text.content,
    annotations: m.annotations
  }))
}

export async function getTexts({filterBy}: {filterBy?: string} = {}): Promise<TextData[]> {
  const { results } = await NotionClient.databases.query({
    database_id: DATABASE_IDS.TEXTOS,
    filter: (filterBy ? ({
      property: 'type',
      select: {
        equals: filterBy
      }
    }) : undefined),
  })

  return results.map((projectData: any) => {
    const { getValue } = propertyUtils(projectData.properties)

    return {
      id: projectData.id,
      createdAt: projectData.created_time,
      updatedAt: projectData.last_edited_time,
      icon: getValue(projectData.icon),
      title: transformMessageData(getValue('title')),
      content: transformMessageData(getValue('content'))
    }
  })
}

async function getSkills(): Promise<SkillData[]> {
  const { results } = await NotionClient.databases.query({
    database_id: DATABASE_IDS.SKILLS
  })

  return results.map((projectData: any) => {
    const { getValue } = propertyUtils(projectData.properties)

    return {
      id: projectData.id,
      name: getValue('name')?.[0].plain_text,
      icon: getValue(projectData.icon)
    }
  })
}

export const SKILLS = await getSkills()

export async function getProjects(): Promise<ProjectData[]> {
  const { results } = await NotionClient.databases.query({
    database_id: DATABASE_IDS.PROJECTS,
    filter: {
      property: 'state',
      status: {
        equals: 'Done'
      }
    },
    sorts: [
      {
        property: 'position',
        direction: 'descending'
      }
    ]
  })

  // return results
  return results.map((projectData: any) => {
    const { getValue } = propertyUtils(projectData.properties)
  
    return {
      id: projectData.id,
      icon: getValue(projectData.icon),
      createdAt: getValue('createdAt')?.start,
      updatedAt: getValue('updatedAt')?.start,
      position: getValue('position'),
      repository: getValue('repository'),
      page: getValue('page'),
      skills: SKILLS.filter(s => getValue<{id: string}[]>('skills').some((sm) => sm.id == s.id)),
      screenshots: getValue('screenshots')?.map(getValue),
      state: getValue('state')?.name,
      title: transformMessageData(getValue('title')),
      description: transformMessageData(getValue('description'))
    }
  })
}

export const PROJECTS = await getProjects()
