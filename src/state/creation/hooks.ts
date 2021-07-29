import { useMemo } from 'react'
import { CreateLockerData, TimeScheduleType } from '../../components/Creation'

export function useCheckLockerSchedule(data: CreateLockerData): boolean {
  return useMemo(() => {
    if (data.schedule === TimeScheduleType.Flexible) return true

    if (data.unlockData.datetime && data.schedule === TimeScheduleType.OneTIme) {
      return true
    }

    if (data.unlockData.datetime && data.unlockData.percentage && data.schedule === TimeScheduleType.Shedule) {
      return true
    }

    return false
  }, [data])
}
