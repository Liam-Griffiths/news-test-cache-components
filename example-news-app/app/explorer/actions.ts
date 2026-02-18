'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateCacheTag(tag: string): Promise<void> {
  revalidateTag(tag)
}

export async function revalidateAllCacheTags(): Promise<void> {
  revalidateTag('news')
}
