import fetch from 'node-fetch'

export interface Fetch {
  readonly fetchFile: (fileURL: string) => Promise<string | undefined>
}

export function createFetch(): Fetch {
  async function fetchFile(fileURL: string): Promise<string | undefined> {
    try {
      const response = await fetch(fileURL)
      return response.text()
    } catch (error) {
      console.error(
        `Failed to fetch file ${fileURL} due to the following error ${error}, returning undefined...`,
      )
      return undefined
    }
  }

  return Object.freeze({
    fetchFile,
  })
}
