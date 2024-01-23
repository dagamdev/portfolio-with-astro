import { type Socket } from 'socket.io-client'

interface ServerToClientEvents {
  analytics: (analytics: AnalyticData) => void
  presenceUpdate: (presence: CustomPresence) => void
}

interface ClientToServerEvents {
  addLike: (analyticData: AnalyticsEventsProps) => void
  removeLike: (analyticData: AnalyticsEventsProps) => void
  addView: (analyticData: AnalyticsEventsProps) => void
}

export type SocketData = Socket<ServerToClientEvents, ClientToServerEvents>

export interface AnalyticsData {
  views: number
  likes: number
  origin: string
  browsers: Array<{
    id: string
    liked: boolean
    lastVisitAt: number
  }>
}

export interface AnalyticsEventsProps {
  id?: string
  browserID: string
}

export interface MessageData {
  link: string | null
  content: string
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
}

export interface TextData {
  id: string
  createdAt: string
  updatedAt: string
  icon: string | null
  title: MessageData[]
  text: MessageData[]
}

interface ImageUrlData {
  url: string
  expiry_time: string
}

export interface SkillData {
  id: string
  name: NotionTextData[]
  icon: ImageUrlData | null
}

export interface ProjectData {
  id: string
  page: string | null
  state: 'Done' | 'In progress' | 'Not started'
  title: MessageData[] | null
  skills: SkillData[] | null
  createdAt: string
  updatedAt: string
  position: number | null
  repository: string | null
  description: MessageData[]
  screenshots: ImageUrlData[]
}
