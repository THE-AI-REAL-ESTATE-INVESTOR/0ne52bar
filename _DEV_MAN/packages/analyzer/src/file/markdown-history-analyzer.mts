/// <reference types="node" />

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { CodeMetrics } from '../types/types.mts';
import { promises as fsPromises } from 'fs';

interface BranchInfo {
  name: string;
  lastCommitDate: Date;
  lastCommitMessage: string;
  author: string;
  commitCount: number;
}

export class MarkdownHistoryAnalyzer {
  private outputPath: string = 'output/WHATS_WORKING_HISTORY.md';
  private hasStashedChanges: boolean = false;
  private originalBranch: string = '';
  private consolidatedHistory: string = '';
  private branchInfos: BranchInfo[] = [];

  constructor() {
    // Store the current branch name
    this.originalBranch = this.getCurrentBranch();
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(this.outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  private getCurrentBranch(): string {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  }

  private getBranchInfo(branchName: string): BranchInfo {
    try {
      const lastCommitDate = new Date(execSync(`git log -1 --format=%cd ${branchName}`).toString().trim());
      const lastCommitMessage = execSync(`git log -1 --format=%s ${branchName}`).toString().trim();
      const author = execSync(`git log -1 --format=%an ${branchName}`).toString().trim();
      const commitCount = parseInt(execSync(`git rev-list --count ${branchName}`).toString().trim());

      return {
        name: branchName,
        lastCommitDate,
        lastCommitMessage,
        author,
        commitCount
      };
    } catch (error) {
      console.error(`Error getting info for branch ${branchName}:`, error);
      return {
        name: branchName,
        lastCommitDate: new Date(0),
        lastCommitMessage: 'Unknown',
        author: 'Unknown',
        commitCount: 0
      };
    }
  }

  private async stashChanges(): Promise<void> {
    try {
      const status = execSync('git status --porcelain').toString();
      if (status) {
        execSync('git stash');
        this.hasStashedChanges = true;
      }
    } catch (error) {
      console.error('Error stashing changes:', error);
    }
  }

  private async popStashedChanges(): Promise<void> {
    if (this.hasStashedChanges) {
      try {
        execSync('git stash pop');
        this.hasStashedChanges = false;
      } catch (error) {
        console.error('Error popping stashed changes:', error);
      }
    }
  }

  private async checkoutBranch(branchName: string): Promise<void> {
    try {
      await this.stashChanges();
      execSync(`git checkout ${branchName}`);
      console.log(`Switched to branch '${branchName}'`);
    } catch (error) {
      console.error(`Error checking out branch ${branchName}:`, error);
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  private generateHistoryEntry(branchInfo: BranchInfo): string {
    const content = fs.readFileSync('WHATS_WORKING.md', 'utf8');
    return `## Branch: ${branchInfo.name} - ${this.formatDate(branchInfo.lastCommitDate)}

Last Commit: ${branchInfo.lastCommitMessage}
Author: ${branchInfo.author}
Total Commits: ${branchInfo.commitCount}

${content}

---
`;
  }

  public async analyze(): Promise<CodeMetrics> {
    console.log('Starting markdown history analysis...');
    
    // Get list of all branches
    const branches = execSync('git branch -a')
      .toString()
      .split('\n')
      .map(b => b.trim().replace('* ', ''))
      .filter(b => b && !b.includes('HEAD') && !b.includes('remotes/'));

    // Analyze each branch
    for (const branch of branches) {
      try {
        await this.checkoutBranch(branch);
        if (fs.existsSync('WHATS_WORKING.md')) {
          const branchInfo = this.getBranchInfo(branch);
          this.branchInfos.push(branchInfo);
        }
      } catch (error) {
        console.error(`Error processing branch ${branch}:`, error);
      }
    }

    // Sort branch infos by date
    this.branchInfos.sort((a, b) => b.lastCommitDate.getTime() - a.lastCommitDate.getTime());

    // Generate consolidated history
    this.consolidatedHistory = `# ONE52 Bar & Grill Marketing Operations - Historical Updates

*This file contains historical updates from all branches, sorted by most recent*

`;

    for (const branchInfo of this.branchInfos) {
      try {
        await this.checkoutBranch(branchInfo.name);
        if (fs.existsSync('WHATS_WORKING.md')) {
          this.consolidatedHistory += this.generateHistoryEntry(branchInfo);
        }
      } catch (error) {
        console.error(`Error generating history for branch ${branchInfo.name}:`, error);
      }
    }

    // Return to original branch
    await this.checkoutBranch(this.originalBranch);
    await this.popStashedChanges();

    // Write consolidated history to file
    fs.writeFileSync(this.outputPath, this.consolidatedHistory);

    console.log('Analysis complete!');
    console.log(`Generated history file: ${path.resolve(this.outputPath)}`);
    console.log(`Branches analyzed: ${branches.length}`);
    console.log(`History entries: ${this.branchInfos.length}`);

    // Calculate metrics
    const totalLines = this.consolidatedHistory.split('\n').length;
    const commentLines = this.consolidatedHistory.split('\n').filter(line => line.startsWith('*')).length;

    return {
      totalLines,
      codeLines: totalLines - commentLines,
      commentLines,
      blankLines: this.consolidatedHistory.split('\n').filter(line => line.trim() === '').length,
      complexity: this.branchInfos.length // Use number of branches as complexity metric
    };
  }

  async analyzeDirectory(dirPath: string): Promise<{ [key: string]: CodeMetrics }> {
    const results: { [key: string]: CodeMetrics } = {};
    const files = await fsPromises.readdir(dirPath);

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(dirPath, file);
        const stats = await fsPromises.stat(filePath);
        
        if (stats.isFile()) {
          results[file] = await this.analyze();
        }
      }
    }

    return results;
  }
} 