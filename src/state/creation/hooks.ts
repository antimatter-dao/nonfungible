import { useMemo } from 'react'
import { CreateLockerData, TimeScheduleType, LockerType } from '../../components/Creation'

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

export function useCheckLockerContent(data: CreateLockerData): boolean {
  return useMemo(() => {
    if (!data.name.trim() || !data.message.trim()) return false

    if (data.creationType === LockerType.ERC1155 && !data.copies.trim()) {
      return false
    }
    return true
  }, [data])
}
