import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  GitBranch,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Sliders,
  Users,
  Trello,
  HelpCircle,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Edit,
  ArrowRight,
  PlusCircle,
  X
} from 'lucide-react';
import { api } from '../services/api';

export const SEPMWorkspacePage = () => {
  const [activeTab, setActiveTab] = useState('sdlc');
  const [sdlcData, setSdlcData] = useState(null);
  const [reqData, setReqData] = useState(null);
  const [toolsData, setToolsData] = useState(null);
  const [sprintData, setSprintData] = useState(null);
  const [kanbanData, setKanbanData] = useState(null);
  const [pokerData, setPokerData] = useState(null);
  const [leanData, setLeanData] = useState(null);
  const [syllabusData, setSyllabusData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kanban New Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStoryId, setNewTaskStoryId] = useState('US-01');
  const [newTaskStatus, setNewTaskStatus] = useState('To Do');
  const [newTaskHours, setNewTaskHours] = useState('4');

  // Planning Poker Selected Vote
  const [userPokerVote, setUserPokerVote] = useState(8);

  useEffect(() => {
    loadAllSEPM();
  }, []);

  const loadAllSEPM = async () => {
    setLoading(true);
    try {
      const [sdlc, req, tools, spr, kan, pok, lean, syl] = await Promise.all([
        api.getSDLC(),
        api.getRequirements(),
        api.getAITools(),
        api.getSprints(),
        api.getKanbanTasks(),
        api.getPlanningPoker(),
        api.getLeanWaste(),
        api.getSyllabus()
      ]);
      setSdlcData(sdlc);
      setReqData(req);
      setToolsData(tools);
      setSprintData(spr);
      setKanbanData(kan);
      setPokerData(pok);
      setLeanData(lean);
      setSyllabusData(syl);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveKanban = async (taskId, newStatus) => {
    try {
      await api.updateKanbanTask(taskId, newStatus);
      const updated = await api.getKanbanTasks();
      setKanbanData(updated);
    } catch (e) {
      alert('Error updating task: ' + e.message);
    }
  };

  const handleCreateKanbanTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await api.createKanbanTask({
        title: newTaskTitle,
        storyId: newTaskStoryId,
        status: newTaskStatus,
        hours: Number(newTaskHours) || 4,
        assignee: 'Maruthi Dapke'
      });
      setShowTaskModal(false);
      setNewTaskTitle('');
      const updated = await api.getKanbanTasks();
      setKanbanData(updated);
    } catch (err) {
      alert('Failed to create task: ' + err.message);
    }
  };

  const handleToggleSyllabus = async (item) => {
    const nextStatus = item.status === 'Completed' ? 'In Review' : 'Completed';
    try {
      await api.updateSyllabusItem(item.id, { status: nextStatus });
      setSyllabusData(prev => ({
        ...prev,
        syllabus: prev.syllabus.map(s => s.id === item.id ? { ...s, status: nextStatus } : s)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'sdlc', label: '1. SDLC Process Models' },
    { id: 'requirements', label: '2. Requirements Engineering' },
    { id: 'ai-tools', label: '3. AI Tools Evaluation' },
    { id: 'agile-scrum', label: '4. Agile & Scrum Sprints' },
    { id: 'kanban', label: '5. Interactive Kanban' },
    { id: 'poker', label: '6. Planning Poker' },
    { id: 'lean', label: '7. Lean Waste Tracking' },
    { id: 'syllabus', label: '8. 28-Day Syllabus Tracker', badge: '32 Topics' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-navy-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-royal/40 text-blue-300 border border-blue-400/30">
              SEPM Academic Workspace • Project P59
            </span>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-brand-royal" />
              Software Engineering & Project Management Hub
            </h1>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
              Demonstrates compliance across all 5 SEPM curriculum phases: Requirements Engineering, Agile Scrum, Planning Poker, Kanban, CI/CD, Testing, and SQA.
            </p>
          </div>

          <button
            onClick={loadAllSEPM}
            className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-600 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Artifacts
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-6 border-t border-navy-700/80 mt-5 text-xs font-bold">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === t.id
                  ? 'bg-brand-royal text-white shadow-md shadow-brand-royal/30'
                  : 'bg-navy-800/80 text-slate-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              {t.label}
              {t.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-navy-950 font-black">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: SDLC Process Models */}
      {activeTab === 'sdlc' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Selected SDLC Paradigm
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-2">
              {sdlcData?.selectedModel || 'Iterative-Incremental Agile with AI Rapid Prototyping'}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
              {sdlcData?.justification}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(sdlcData?.modelsComparison || []).map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-900">{m.name}</h3>
                  <span className="text-[10px] font-semibold text-slate-500">{m.suitability}</span>
                </div>
                <p className="text-slate-500 text-[11px]"><strong>Stages:</strong> {m.stages}</p>
                <p className="text-emerald-700 text-[11px]"><strong>Pros:</strong> {m.advantages}</p>
                <p className="text-rose-700 text-[11px]"><strong>Cons:</strong> {m.disadvantages}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Requirements Engineering */}
      {activeTab === 'requirements' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Functional & Non-Functional Requirements</h2>
            <p className="text-xs text-slate-500">IEEE 830 compliant requirements matrix with human vs AI SRS evolution</p>
          </div>
          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Req ID</th>
                  <th className="py-2.5 px-3">Requirement Title</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(reqData?.functionalRequirements || []).map((fr) => (
                  <tr key={fr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-brand-royal">{fr.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{fr.title}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {fr.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {fr.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{fr.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: AI Tools Evaluation */}
      {activeTab === 'ai-tools' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Comparative AI Development Tool Benchmark</h2>
            <p className="text-xs text-slate-500">Evaluation across Correctness, Readability, Security, Maintainability, and Speed</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(toolsData?.tools || []).map((t, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-extrabold text-sm text-slate-900">{t.name}</h3>
                  <span className="text-xs font-black text-brand-royal bg-white px-2 py-0.5 rounded border border-slate-200">
                    {((t.correctness + t.readability + t.security + t.maintainability + t.speed) / 5).toFixed(1)} / 10
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Correctness:</span><span className="font-bold text-slate-800">{t.correctness} / 10</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Readability:</span><span className="font-bold text-slate-800">{t.readability} / 10</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Security:</span><span className="font-bold text-slate-800">{t.security} / 10</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Maintainability:</span><span className="font-bold text-slate-800">{t.maintainability} / 10</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Speed:</span><span className="font-bold text-slate-800">{t.speed} / 10</span></div>
                </div>
                <div className="text-[11px] space-y-1 pt-2 border-t border-slate-200 text-slate-600">
                  <p><strong>Strengths:</strong> {t.strengths}</p>
                  <p className="text-slate-500"><strong>Limitations:</strong> {t.weaknesses}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Agile & Scrum Sprints */}
      {activeTab === 'agile-scrum' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(sprintData?.sprints || []).map((spr) => (
              <div key={spr.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-black text-sm text-slate-900">{spr.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {spr.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong>Sprint Goal:</strong> {spr.goal}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Committed</span>
                    <span className="font-black text-slate-800">{spr.storyPointsCommitted} pts</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <span className="text-[10px] text-emerald-600 block font-semibold">Completed</span>
                    <span className="font-black text-emerald-700">{spr.storyPointsCompleted} pts</span>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                    <span className="text-[10px] text-blue-600 block font-semibold">Scrum Master</span>
                    <span className="font-bold text-brand-royal text-[11px] truncate block">{spr.scrumMaster}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Interactive Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Interactive Kanban Workflow Board</h2>
              <p className="text-xs text-slate-500">6 workflow stages with enforced WIP limits. Move tasks across columns or create new tasks.</p>
            </div>
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-3.5 py-2 rounded-xl bg-brand-royal hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {(kanbanData?.columns || ['Backlog', 'To Do', 'In Progress', 'Code Review', 'Testing', 'Done']).map((col) => {
              const colTasks = (kanbanData?.tasks || []).filter(t => t.status === col);
              return (
                <div key={col} className="bg-slate-100/70 rounded-2xl p-3 flex flex-col space-y-2 border border-slate-200/60 min-h-[400px]">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-bold text-xs text-slate-700">{col}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {colTasks.map((task) => (
                      <div key={task.id} className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 space-y-2 text-xs">
                        <span className="text-[10px] font-mono font-bold text-brand-royal block">{task.id}</span>
                        <p className="font-semibold text-slate-800 leading-tight">{task.title}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          <span>{task.hours} hrs</span>
                          <span>{task.assignee}</span>
                        </div>

                        {/* Status Shift Buttons */}
                        <div className="flex items-center justify-between pt-1 gap-1">
                          {col !== 'Backlog' && (
                            <button
                              onClick={() => {
                                const cols = kanbanData.columns;
                                const prev = cols[cols.indexOf(col) - 1];
                                handleMoveKanban(task.id, prev);
                              }}
                              className="text-[10px] text-slate-500 hover:text-slate-800 font-bold"
                            >
                              &larr; Prev
                            </button>
                          )}
                          {col !== 'Done' && (
                            <button
                              onClick={() => {
                                const cols = kanbanData.columns;
                                const next = cols[cols.indexOf(col) + 1];
                                handleMoveKanban(task.id, next);
                              }}
                              className="text-[10px] text-brand-royal hover:text-blue-700 font-bold ml-auto"
                            >
                              Next &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal to Add New Kanban Task */}
          {showTaskModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-brand-royal" />
                    Create Kanban Task
                  </h3>
                  <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateKanbanTask} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Task Title</label>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="e.g. Implement Webhook for Real-time Instagram Comments"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Parent User Story</label>
                      <select
                        value={newTaskStoryId}
                        onChange={(e) => setNewTaskStoryId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                      >
                        <option value="US-01">US-01 (OAuth Flow)</option>
                        <option value="US-02">US-02 (Instagram Connector)</option>
                        <option value="US-04">US-04 (Calendar Scheduler)</option>
                        <option value="US-05">US-05 (Sentiment Engine)</option>
                        <option value="US-07">US-07 (Engagement Prediction)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Starting Column</label>
                      <select
                        value={newTaskStatus}
                        onChange={(e) => setNewTaskStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                      >
                        <option value="Backlog">Backlog</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Estimated Hours</label>
                    <input
                      type="number"
                      value={newTaskHours}
                      onChange={(e) => setNewTaskHours(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                      min="1"
                      max="40"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowTaskModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-brand-royal hover:bg-blue-700 text-white font-semibold shadow-sm"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Planning Poker */}
      {activeTab === 'poker' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Planning Poker Session: Story Point Estimation</h2>
              <p className="text-xs text-slate-500">Estimating User Story US-07 with Fibonacci consensus voting</p>
            </div>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Interactive Card Deck
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono font-bold text-xs text-brand-royal">{pokerData?.activeStory?.id}</span>
            <h3 className="font-bold text-sm text-slate-900">{pokerData?.activeStory?.title}</h3>
            <p className="text-xs text-slate-600">{pokerData?.activeStory?.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Your Fibonacci Card (Current Vote: {userPokerVote} pts)
            </h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 5, 8, 13, 21].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setUserPokerVote(val)}
                  className={`w-14 h-20 rounded-xl border-2 flex items-center justify-center font-black text-lg transition-transform hover:scale-105 shadow-xs cursor-pointer ${
                    userPokerVote === val
                      ? 'border-brand-royal bg-blue-50 text-brand-royal scale-105 shadow-md'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Team Estimates & Consensus Log</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(pokerData?.votes || []).map((v, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-800 block">{v.member}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{v.rationale}</p>
                  </div>
                  <span className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-black text-sm flex items-center justify-center text-brand-royal shadow-xs">
                    {idx === 0 ? userPokerVote : v.vote}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Lean Waste Tracking */}
      {activeTab === 'lean' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Lean Software Development Waste Tracking</h2>
            <p className="text-xs text-slate-500">Measurable reduction of software development waste before vs after automation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(leanData?.waste || []).map((w, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-sm text-slate-900">{w.category}</span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {w.improvement}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{w.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
                    <span className="text-[10px] text-rose-600 block font-semibold">Before Automation:</span>
                    <span className="font-bold text-rose-800">{w.beforeScore}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <span className="text-[10px] text-emerald-600 block font-semibold">After Automation:</span>
                    <span className="font-bold text-emerald-800">{w.afterScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: 28-Day Handbook Syllabus Tracker */}
      {activeTab === 'syllabus' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">28-Day Handbook Syllabus Compliance Tracker</h3>
              <p className="text-xs text-slate-500">Verification of all 32 syllabus outcomes from Phase 1 through Phase 5. Click status pill to toggle review state.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              32 / 32 Tracked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Syllabus ID</th>
                  <th className="py-3 px-4">Phase</th>
                  <th className="py-3 px-4">Topic & Activity</th>
                  <th className="py-3 px-4">Implementation Evidence</th>
                  <th className="py-3 px-4">Status (Click to Toggle)</th>
                  <th className="py-3 px-4">Reviewer Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(syllabusData?.syllabus || []).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-brand-royal">{item.id}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">{item.phase}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 max-w-xs">{item.topic}</td>
                    <td className="py-3 px-4 font-mono text-purple-700 text-[11px]">{item.evidence}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleSyllabus(item)}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                          item.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{item.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEPMWorkspacePage;
