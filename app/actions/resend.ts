"use server";

import { Resend } from 'resend';
import { Project, Todo, AppState } from '@/lib/types/clarity.types';

const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

interface EmailContext {
  projects: Project[];
  todos: Todo[];
  analytics: AppState['analytics'];
  userEmail?: string;
}

function generateDailySummaryHTML(context: EmailContext): string {
  const { projects, todos, analytics } = context;
  const activeProjects = projects.filter(p => p.status === 'active');
  const urgentTodos = todos.filter(t => t.priority === 'urgent' && t.status !== 'completed');
  const completedTodos = todos.filter(t => t.status === 'completed' && 
    new Date(t.completedAt || '').toDateString() === new Date().toDateString()
  );

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Clarity Daily Summary</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .metric-card { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 15px 0; border-left: 4px solid #667eea; }
        .metric-value { font-size: 24px; font-weight: bold; color: #1a202c; }
        .metric-label { color: #718096; font-size: 14px; margin-top: 5px; }
        .project-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 10px 0; }
        .progress-bar { background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden; margin: 10px 0; }
        .progress-fill { background: #48bb78; height: 100%; transition: width 0.3s ease; }
        .urgent { border-left-color: #f56565; }
        .completed { color: #48bb78; }
        .cta-button { background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🎯 Clarity Daily Summary</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        
        <div class="content">
          <h2 style="color: #2d3748; margin-bottom: 20px;">📊 Today's Metrics</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="metric-card">
              <div class="metric-value">${completedTodos.length}</div>
              <div class="metric-label">Tasks Completed Today</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${activeProjects.length}</div>
              <div class="metric-label">Active Projects</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">$${analytics.totalRevenue.toLocaleString()}</div>
            <div class="metric-label">Total Revenue This Month</div>
          </div>

          ${urgentTodos.length > 0 ? `
            <h3 style="color: #e53e3e; margin: 30px 0 15px 0;">🚨 Urgent Tasks</h3>
            ${urgentTodos.map(todo => `
              <div class="project-card urgent">
                <strong>${todo.title}</strong>
                ${todo.projectId ? `<br><small>Project: ${projects.find(p => p.id === todo.projectId)?.title || 'Unknown'}</small>` : ''}
              </div>
            `).join('')}
          ` : ''}

          ${activeProjects.length > 0 ? `
            <h3 style="color: #2d3748; margin: 30px 0 15px 0;">🚀 Active Projects</h3>
            ${activeProjects.slice(0, 3).map(project => `
              <div class="project-card">
                <strong>${project.title}</strong>
                ${project.clientName ? `<br><small>Client: ${project.clientName}</small>` : ''}
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <small>${project.progress}% complete</small>
              </div>
            `).join('')}
          ` : ''}

          ${completedTodos.length > 0 ? `
            <h3 style="color: #48bb78; margin: 30px 0 15px 0;">✅ Completed Today</h3>
            ${completedTodos.slice(0, 5).map(todo => `
              <div class="project-card completed">
                <strong>✓ ${todo.title}</strong>
              </div>
            `).join('')}
          ` : ''}

          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'}" class="cta-button">
              Open Clarity Dashboard
            </a>
          </div>

          <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 30px;">
            Keep up the great work! This summary was generated automatically by Clarity.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateProjectUpdateHTML(project: Project, todos: Todo[]): string {
  const projectTodos = todos.filter(t => t.projectId === project.id);
  const completedTodos = projectTodos.filter(t => t.status === 'completed');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Project Update: ${project.title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: ${project.category === 'client' ? '#48bb78' : project.category === 'work' ? '#4299e1' : '#9f7aea'}; color: white; padding: 30px; }
        .content { padding: 30px; }
        .progress-bar { background: #e2e8f0; height: 12px; border-radius: 6px; overflow: hidden; margin: 15px 0; }
        .progress-fill { background: #48bb78; height: 100%; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .status-active { background: #bee3f8; color: #2b6cb0; }
        .status-completed { background: #c6f6d5; color: #2f855a; }
        .status-planning { background: #fed7d7; color: #c53030; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">${project.title}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Project Update</p>
        </div>
        
        <div class="content">
          <div style="margin-bottom: 20px;">
            <span class="status-badge status-${project.status}">${project.status}</span>
            ${project.clientName ? `<br><br><strong>Client:</strong> ${project.clientName}` : ''}
          </div>
          
          <h3>Progress: ${project.progress}%</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${project.progress}%"></div>
          </div>
          
          ${project.description ? `
            <h4>Description</h4>
            <p>${project.description}</p>
          ` : ''}
          
          ${projectTodos.length > 0 ? `
            <h4>Tasks (${completedTodos.length}/${projectTodos.length} completed)</h4>
            <ul>
              ${projectTodos.map(todo => `
                <li style="color: ${todo.status === 'completed' ? '#48bb78' : '#2d3748'};">
                  ${todo.status === 'completed' ? '✅' : '⏳'} ${todo.title}
                </li>
              `).join('')}
            </ul>
          ` : ''}
          
          ${project.budget ? `
            <h4>Budget</h4>
            <p>$${project.budget.toLocaleString()}</p>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'}" 
               style="background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
              View in Clarity
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================================================
// EMAIL ACTIONS
// ============================================================================

export async function sendDailySummary(context: EmailContext): Promise<boolean> {
  try {
    const { userEmail = 'hello@fbien.com' } = context;
    
    const { data, error } = await resend.emails.send({
      from: 'Clarity <noreply-clarity@mail.fbien.com>',
      to: [userEmail],
      subject: `🎯 Clarity Daily Summary - ${new Date().toLocaleDateString()}`,
      html: generateDailySummaryHTML(context),
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    console.log('Daily summary sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Failed to send daily summary:', error);
    return false;
  }
}

export async function sendProjectUpdate(
  project: Project, 
  todos: Todo[], 
  userEmail: string = 'hello@fbien.com'
): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Clarity <noreply@mail.fbien.com>',
      to: [userEmail],
      subject: `📋 Project Update: ${project.title}`,
      html: generateProjectUpdateHTML(project, todos),
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    console.log('Project update sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Failed to send project update:', error);
    return false;
  }
}

export async function sendUrgentTaskAlert(
  todos: Todo[], 
  projects: Project[], 
  userEmail: string = 'hello@fbien.com'
): Promise<boolean> {
  try {
    const urgentTodos = todos.filter(t => t.priority === 'urgent' && t.status !== 'completed');
    
    if (urgentTodos.length === 0) return true;

    const { data, error } = await resend.emails.send({
      from: 'Clarity <noreply@mail.fbien.com>',
      to: [userEmail],
      subject: `🚨 ${urgentTodos.length} Urgent Task${urgentTodos.length > 1 ? 's' : ''} Need Attention`,
      html: `
        <h2>🚨 Urgent Tasks Requiring Attention</h2>
        <ul>
          ${urgentTodos.map(todo => `
            <li>
              <strong>${todo.title}</strong>
              ${todo.projectId ? `<br><small>Project: ${projects.find(p => p.id === todo.projectId)?.title}</small>` : ''}
            </li>
          `).join('')}
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'}">Open Clarity Dashboard</a>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    console.log('Urgent task alert sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Failed to send urgent task alert:', error);
    return false;
  }
}

// ============================================================================
// SCHEDULED EMAIL FUNCTIONS
// ============================================================================

export async function scheduleDailyEmail(appState: AppState): Promise<boolean> {
  const context: EmailContext = {
    projects: appState.projects,
    todos: appState.todos,
    analytics: appState.analytics,
  };
  
  return await sendDailySummary(context);
}

export async function sendOnDemandReport(
  appState: AppState, 
  userEmail: string = 'hello@fbien.com'
): Promise<boolean> {
  const context: EmailContext = {
    projects: appState.projects,
    todos: appState.todos,
    analytics: appState.analytics,
    userEmail,
  };
  
  return await sendDailySummary(context);
}
