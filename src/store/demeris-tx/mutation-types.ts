import * as API from '@/types/api'

export enum DemerisMutationTypes {
  RESET_STATE = 'RESET_STATE',
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export type DemerisMutationArgs = void

export type DemerisMutations = {
  params?: API.APIRequests
  value: DemerisMutationArgs
}
