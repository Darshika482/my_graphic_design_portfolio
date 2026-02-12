import { Octokit } from '@octokit/rest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Darshika482';
const REPO_NAME = 'my_graphic_design_portfolio';
const BRANCH = 'main';

// Map category IDs to folder paths
const categoryFolderMap: Record<string, string> = {
  'poster-banner': 'new poster',
  'academic-book': 'books',
  'school-branding': 'detailed graphics',
  'stationery': 'letterhead',
  'event-branding': 'websites',
  'logo-design': 'logos',
  'classroom-visual': 'only graphics',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for GitHub token
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  const { category, files } = req.body;

  if (!category || !files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: 'Invalid request: category and files are required' });
  }

  const folderPath = categoryFolderMap[category];
  if (!folderPath) {
    return res.status(400).json({ error: `Unknown category: ${category}` });
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  try {
    const uploadResults = [];

    // Upload each file
    for (const file of files) {
      const fileName = file.name;
      const filePath = `assets/${folderPath}/${fileName}`;
      
      // Check if file already exists
      let sha: string | undefined;
      try {
        const existingFile = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: filePath,
          ref: BRANCH,
        });

        if (Array.isArray(existingFile.data)) {
          // It's a directory, skip
        } else {
          sha = existingFile.data.sha;
        }
      } catch (error: any) {
        // File doesn't exist, that's fine
        if (error.status !== 404) {
          throw error;
        }
      }

      // Upload or update file
      await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: filePath,
        message: `Add ${fileName} to ${category}`,
        content: file.content,
        encoding: 'base64',
        branch: BRANCH,
        sha: sha,
      });

      uploadResults.push({
        fileName,
        path: filePath,
        success: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully uploaded ${uploadResults.length} file(s)`,
      results: uploadResults,
    });
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to upload files to GitHub',
      details: error.response?.data || null,
    });
  }
}
