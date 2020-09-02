import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('GITHUB_TOKEN')
    const octokit = github.getOctokit(githubToken)
    const repoInfo = github.context.repo

    const readme = await octokit.request(
      `GET /repos/${repoInfo.owner}/${repoInfo.repo}/readme`,
      {
        headers: {
          authorization: `token ${githubToken}`
        }
      }
    )

    if (readme.headers.status === '404') {
      core.error('readme not added')
      return
    }

    const sponsors = await octokit.request(
      `GET /repos/${repoInfo.owner}/${repoInfo.repo}/sponsors`,
      {
        headers: {
          authorization: `token ${githubToken}`
        }
      }
    )

    if (sponsors.headers.status === '404') {
      core.error('sponsors not added')
      return
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
