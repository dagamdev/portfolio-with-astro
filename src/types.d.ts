import { Socket } from 'socket.io-client'

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
  browsers: {
    id: string
    liked: boolean
    lastVisitAt: number
  }[]
}

export interface AnalyticsEventsProps {
  id?: string
  browserID: string
}
