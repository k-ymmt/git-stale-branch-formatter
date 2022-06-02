import {writeFile} from 'fs'
import * as path from 'path'
import {$, cd} from 'zx'

const targetDirectory = ''
const githubUrl = ''
const outputFileName = 'stale_branches.csv'
const outputDirectory = '.'

$.verbose = 0

interface Branch {
  name: string
  date: string
  author: string
  pr: {
    number?: number
    state: string
  }
}

await cd(targetDirectory)
const names = await $`git branch -r --sort=committerdate`

const branches = await Promise.all(
  names.stdout
    .split('\n')
    .map(name => name.trim())
    .filter(name => name !== '' && !name.includes('->'))
    .map(async (name): Promise<Branch> => {
      const result = await $`git show -s --format="%cr||%an" ${name} --date=short`
      const [date, author,] = result.stdout.trim().split('||')
      const originalName = name.replace('origin/', '')
      let pr: Branch["pr"]
      try {
        const ghResult = await $`gh pr view ${originalName} --json number,state`
        pr = JSON.parse(ghResult.stdout)
      } catch {
        pr = {
          state: 'No PR'
        }
      }

      return {
        name: originalName,
        date,
        author,
        pr
      }
    })
)

const header = 'Branch Name,Updated,PR Status,PR URL,Author'
const output = [header].concat(branches.map(branch => {
  function prLink(number?: number): string {
    if (!number) {
      return ""
    }
    return `"=HYPERLINK(""${githubUrl}/pull/${number}"",""#${number}"")"`
  }

  return `${branch.name},"${branch.date}",${branch.pr.state},${prLink(branch.pr.number)},${branch.author}`
})).join('\n')

await new Promise((resolve, reject) => {
  writeFile(`${path.join(outputDirectory, outputFileName)}`, output, (err) => {
    if (err) {
      reject(err)
      return
    }

    resolve(0)
  })
})
