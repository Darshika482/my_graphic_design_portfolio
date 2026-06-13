import { Octokit } from '@octokit/rest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Darshika482';
const REPO_NAME = 'my_graphic_design_portfolio';
const BRANCH = 'main';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  const { filePath } = req.body;

  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ error: 'filePath is required' });
  }

  // Guard against path traversal
  if (filePath.includes('..') || !filePath.startsWith('assets/')) {
    return res.status(400).json({ error: 'Invalid file path' });
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      ref: BRANCH,
    });

    if (Array.isArray(data)) {
      return res.status(400).json({ error: 'Path is a directory, not a file' });
    }

    const fileName = filePath.split('/').pop() ?? filePath;

    await octokit.repos.deleteFile({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Remove ${fileName} from portfolio`,
      sha: data.sha,
      branch: BRANCH,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('GitHub delete error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to delete file',
    });
  }
}
