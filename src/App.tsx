import React, { useState, useEffect } from 'react';
import { 
  Book, 
  FlaskConical, 
  Layers, 
  Cpu, 
  Car, 
  ShieldCheck, 
  Terminal as TerminalIcon, 
  MessageSquare,
  Search,
  Settings,
  ChevronRight,
  ChevronDown,
  FileText,
  Activity,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from './lib/utils';
import { ModuleId, Tab, Article, Lab, LogEntry, LogLevel } from './types';
import { KNOWLEDGE_BASE } from './data/knowledge';
import { LABS, ARCHITECTURE_DIAGRAMS } from './data/labs';
import { SAMPLE_LOGS } from './data/logs';
import { Mermaid } from './components/Mermaid';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('KNOWLEDGE');
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'welcome', title: 'Welcome', type: 'article' }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('welcome');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiPanelVisible, setAiPanelVisible] = useState(true);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const openTab = (tab: Tab) => {
    if (!tabs.find(t => t.id === tab.id)) {
      setTabs([...tabs, tab]);
    }
    setActiveTabId(tab.id);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    } else if (newTabs.length === 0) {
       openTab({ id: 'welcome', title: 'Welcome', type: 'article' });
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#1e1f22] text-[#bcbec4] font-sans overflow-hidden flex-col">
      {/* Title Bar / Main Menu */}
      <header className="flex items-center justify-between px-3 h-10 bg-[#2b2d30] border-b border-[#393b40] shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#3ddc84] rounded-sm flex items-center justify-center">
              <div className="w-3 h-1 bg-[#1e1f22] rounded-full"></div>
            </div>
            <span className="font-bold text-xs text-white tracking-tight">AOSP Forge</span>
          </div>
          <nav className="hidden md:flex gap-3 text-[11px] text-[#bcbec4]">
            <span className="hover:text-white cursor-default">File</span>
            <span className="hover:text-white cursor-default">Edit</span>
            <span className="hover:text-white cursor-default">Navigate</span>
            <span className="hover:text-white cursor-default">Code</span>
            <span className="hover:text-white cursor-default">Analyze</span>
            <span className="hover:text-white cursor-default">Tools</span>
            <span className="hover:text-white cursor-default">Academy</span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-[#1e1f22] border border-[#4e5157] rounded px-3 py-1 gap-2 min-w-[280px]">
            <Search className="w-3 h-3 text-[#6f737a]" />
            <span className="text-[11px] text-[#6f737a]">Search Everywhere (Shift, Shift)</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4e5157]"></div>
            <div className="w-3 h-3 rounded-full bg-[#4e5157]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Icon Rail */}
        <aside className="w-12 bg-[#2b2d30] border-r border-[#393b40] flex flex-col items-center py-4 gap-6 shrink-0">
          <ModuleIcon icon={Book} label="Knowledge" active={activeModule === 'KNOWLEDGE'} onClick={() => setActiveModule('KNOWLEDGE')} />
          <ModuleIcon icon={FlaskConical} label="Labs" active={activeModule === 'LABS'} onClick={() => setActiveModule('LABS')} />
          <ModuleIcon icon={Layers} label="Architecture" active={activeModule === 'ARCHITECTURE'} onClick={() => setActiveModule('ARCHITECTURE')} />
          <ModuleIcon icon={Cpu} label="System" active={activeModule === 'BINDER'} onClick={() => setActiveModule('BINDER')} />
          <ModuleIcon icon={Car} label="AAOS" active={activeModule === 'AAOS'} onClick={() => setActiveModule('AAOS')} />
          <ModuleIcon icon={TerminalIcon} label="Logcat" active={activeModule === 'LOGCAT'} onClick={() => setActiveModule('LOGCAT')} />
          <div className="mt-auto flex flex-col gap-6 mb-4">
            <ModuleIcon icon={Search} label="Search" active={activeModule === 'SEARCH'} onClick={() => setActiveModule('SEARCH')} />
            <ModuleIcon icon={Settings} label="Settings" active={false} onClick={() => {}} />
          </div>
        </aside>

        {/* Sidebar / Explorer */}
        <motion.div 
          initial={false}
          animate={{ width: sidebarCollapsed ? 0 : 260 }}
          className="bg-[#2b2d30] border-r border-[#393b40] flex flex-col shrink-0 overflow-hidden"
        >
          <div className="p-3 flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6f737a]">Explorer</span>
            <button onClick={() => setSidebarCollapsed(true)} className="text-[#6f737a] hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            {activeModule === 'KNOWLEDGE' && (
              <ExplorerGroup title="Platform Core">
                {KNOWLEDGE_BASE.filter(a => a.category !== 'Automotive').map(item => (
                  <ExplorerItem 
                    key={item.id} 
                    label={item.title} 
                    icon={FileText} 
                    onClick={() => openTab({ id: item.id, title: item.title, type: 'article', contentId: item.id })} 
                  />
                ))}
              </ExplorerGroup>
            )}
            {activeModule === 'LABS' && (
              <ExplorerGroup title="Engineering Labs">
                 {LABS.map(lab => (
                  <ExplorerItem 
                    key={lab.id} 
                    label={lab.title} 
                    icon={FlaskConical} 
                    onClick={() => openTab({ id: lab.id, title: lab.title, type: 'lab', contentId: lab.id })} 
                  />
                ))}
              </ExplorerGroup>
            )}
            {activeModule === 'ARCHITECTURE' && (
              <ExplorerGroup title="Architecture Visualizations">
                 {ARCHITECTURE_DIAGRAMS.map(diagram => (
                  <ExplorerItem 
                    key={diagram.id} 
                    label={diagram.title} 
                    icon={Layers} 
                    onClick={() => openTab({ id: diagram.id, title: diagram.title, type: 'diagram', contentId: diagram.id })} 
                  />
                ))}
              </ExplorerGroup>
            )}
            {activeModule === 'AAOS' && (
              <ExplorerGroup title="AAOS Engineering">
                 {KNOWLEDGE_BASE.filter(a => a.category === 'Automotive').map(item => (
                  <ExplorerItem 
                    key={item.id} 
                    label={item.title} 
                    icon={Car} 
                    onClick={() => openTab({ id: item.id, title: item.title, type: 'article', contentId: item.id })} 
                  />
                ))}
              </ExplorerGroup>
            )}
            {activeModule === 'LOGCAT' && (
              <ExplorerGroup title="Logcat Analysis">
                <ExplorerItem 
                  label="Real-time Stream" 
                  icon={TerminalIcon} 
                  onClick={() => openTab({ id: 'logcat-live', title: 'Logcat: Live', type: 'article', contentId: 'logcat-live' })} 
                />
                <ExplorerItem 
                  label="Saved Buffers" 
                  icon={FileText} 
                  onClick={() => {}} 
                />
              </ExplorerGroup>
            )}
          </div>
          <div className="bg-[#2b2d30] border-t border-[#393b40] p-4 text-[11px]">
            <div className="flex justify-between mb-1.5">
              <span className="text-[#6f737a] uppercase font-bold text-[9px]">Course Mastery</span>
              <span className="text-[#3ddc84] font-bold">42%</span>
            </div>
            <div className="w-full bg-[#1e1f22] h-1 rounded-full overflow-hidden">
              <div className="bg-[#3ddc84] h-full" style={{ width: '42%' }}></div>
            </div>
          </div>
        </motion.div>

        {/* Main Section */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#1e1f22]">
          {/* Tabs Bar */}
          <div className="h-9 bg-[#2b2d30] flex overflow-x-auto no-scrollbar border-b border-[#393b40]">
            {tabs.map(tab => (
              <div 
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "min-w-[120px] max-w-[200px] px-3 flex items-center gap-2 border-r border-[#393b40] cursor-pointer group transition-all",
                  activeTabId === tab.id ? "bg-[#1e1f22] text-white border-t-2 border-[#3ddc84]" : "text-[#6f737a] hover:bg-[#393b40]"
                )}
              >
                <TabIcon type={tab.type} className={cn("w-3.5 h-3.5 shrink-0", activeTabId === tab.id ? "text-[#3ddc84]" : "text-[#6f737a]")} />
                <span className="text-[11px] truncate flex-1">{tab.title}</span>
                <button 
                  onClick={(e) => closeTab(e, tab.id)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-[#4e5157] rounded p-0.5"
                >
                  <ChevronRight className="w-3 h-3 rotate-45 transform" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-hidden flex">
            <div className="flex-1 overflow-y-auto scrollbar-dark">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabId}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="p-10 max-w-4xl mx-auto"
                >
                  {activeTabId === 'welcome' && <WelcomeScreen />}
                  {activeTab?.type === 'article' && activeTab.contentId && (
                     <ArticleRenderer id={activeTab.contentId} />
                  )}
                  {activeTab?.type === 'lab' && activeTab.contentId && (
                     <LabRenderer id={activeTab.contentId} />
                  )}
                  {activeTab?.type === 'diagram' && activeTab.contentId && (
                     <DiagramRenderer id={activeTab.contentId} />
                  )}
                  {activeTab?.id === 'logcat-live' && (
                    <LogcatAnalyzer />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* AI Mentor Panel */}
            {aiPanelVisible && (
              <aside className="w-72 border-l border-[#393b40] bg-[#2b2d30] flex flex-col">
                <div className="h-9 flex items-center px-4 font-bold text-[10px] uppercase tracking-wider text-white bg-[#2b2d30] border-b border-[#393b40] gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#007acc]"></div>
                  AI Mentor
                </div>
                <AiMentorPanel currentContext={activeTab} />
              </aside>
            )}
          </div>

          {/* Bottom Bar / Terminal */}
          <div className="h-40 border-t border-[#393b40] bg-[#1e1f22] flex flex-col font-mono">
            <div className="h-8 bg-[#2b2d30] flex items-center px-4 gap-6 text-[10px] font-bold text-[#6f737a]">
              <button className="text-white border-b-2 border-white h-full flex items-center">Terminal</button>
              <button className="hover:text-white h-full flex items-center">Logcat</button>
              <button className="hover:text-white h-full flex items-center">Output</button>
              <button className="hover:text-white h-full flex items-center">Build</button>
            </div>
            <div className="flex-1 bg-[#1e1f22] p-4 text-[11px] overflow-y-auto text-green-500">
              <div>user@aosp-forge:~$ adb shell service list | grep binder</div>
              <div className="text-[#bcbec4]">42&nbsp;&nbsp;activity: [android.app.IActivityManager]</div>
              <div className="text-[#bcbec4]">43&nbsp;&nbsp;package: [android.content.pm.IPackageManager]</div>
              <div className="text-white animate-pulse mt-1">_</div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer / Status Bar */}
      <footer className="h-6 bg-[#2b2d30] border-t border-[#393b40] text-[#6f737a] flex items-center px-3 text-[10px] justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#3ddc84]"></div>
            <span>Connected: Generic_X86_64</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Branch:</span>
            <span className="text-[#bcbec4]">main</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span className="text-[#bcbec4]">Spaces: 4</span>
          <span>Line 42:12</span>
          <div className="flex items-center gap-1">
             <ShieldCheck className="w-3 h-3" />
             <span>AOSP Secure</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ModuleIcon({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2.5 rounded-md transition-all cursor-pointer relative group",
        active ? "text-[#3ddc84] bg-white/5 border-l-2 border-[#3ddc84] rounded-none" : "text-[#6f737a] hover:text-white"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute left-full ml-3 px-2 py-1 bg-[#1e1f22] text-[#bcbec4] border border-[#393b40] text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
        {label}
      </span>
    </button>
  );
}

function TabIcon({ type, className }: { type: string, className?: string }) {
  switch (type) {
    case 'article': return <FileText className={className} />;
    case 'lab': return <FlaskConical className={className} />;
    case 'diagram': return <Layers className={className} />;
    default: return <FileText className={className} />;
  }
}

function ExplorerGroup({ title, children }: { title: string, children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="mb-2">
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center py-1 text-[11px] font-bold text-white transition-colors hover:text-[#3ddc84]"
      >
        <ChevronRight className={cn("w-3 h-3 transition-transform mr-1 text-[#6f737a]", !collapsed && "rotate-90")} />
        {title}
      </button>
      {!collapsed && <div>{children}</div>}
    </div>
  );
}

function ExplorerItem({ label, icon: Icon, onClick }: { label: string, icon: any, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-1.5 py-1 px-1.5 text-[#bcbec4] hover:bg-[#393b40] rounded cursor-pointer transition-colors text-xs group"
    >
      <Icon className="w-3.5 h-3.5 text-[#6f737a] group-hover:text-[#3ddc84]" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function WelcomeScreen() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold text-white mb-2">AOSP Forge</h1>
      <p className="text-xl text-white/70 leading-relaxed">
        Welcome to the premier engineering academy for Android Platform Development. 
        Deep dive into the source code, master the kernel, and build the future of mobile and automotive platforms.
      </p>
      
      <div className="grid grid-cols-2 gap-4 mt-8">
        <WelcomeCard 
          icon={Layers} 
          title="Architecture Explorer" 
          description="Interactive maps of the Android graphics stack, audio system, and hardware abstraction layer."
        />
        <WelcomeCard 
          icon={Cpu} 
          title="Binder IPC Visualizer" 
          description="Real-time transaction tracing and payload analysis for system-wide communication."
        />
        <WelcomeCard 
          icon={FlaskConical} 
          title="Hands-on Labs" 
          description="Step-by-step engineering labs to build custom ROMs, HALs, and system services."
        />
        <WelcomeCard 
          icon={ShieldCheck} 
          title="Security & SELinux" 
          description="Master MAC, VINTF, and trusted execution environments within the Android stack."
        />
      </div>
    </div>
  );
}

function WelcomeCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-5 bg-[#2b2d30] border border-[#393b40] rounded-xl hover:border-[#3ddc84] transition-all cursor-pointer group shadow-xl">
      <Icon className="w-8 h-8 text-[#3ddc84] mb-4" />
      <h3 className="text-white font-bold mb-2">{title}</h3>
      <p className="text-xs text-[#bcbec4]/60 leading-relaxed">{description}</p>
    </div>
  );
}

function ArticleRenderer({ id }: { id: string }) {
  const article = KNOWLEDGE_BASE.find(a => a.id === id);
  if (!article) return <div>Article not found</div>;

  return (
    <article className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {article.content}
      </ReactMarkdown>
    </article>
  );
}

function LabRenderer({ id }: { id: string }) {
  const lab = LABS.find(l => l.id === id);
  if (!lab) return <div>Lab not found</div>;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-4xl font-bold text-white mb-4 border-b border-[#393b40] pb-6">{lab.title}</h2>
        <div className="flex gap-4 items-center mb-8">
          <span className="text-[10px] px-3 py-1 bg-[#2b2d30] border border-[#3ddc84] text-[#3ddc84] font-bold rounded-full uppercase tracking-widest">{lab.difficulty}</span>
          <span className="text-xs text-[#6f737a] font-medium italic">{lab.timeEstimate} completion time</span>
        </div>
        <p className="text-xl text-[#bcbec4] leading-relaxed font-light">{lab.objective}</p>
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-6 h-1 bg-[#3ddc84]"></div>
          Instructions
        </h3>
        <ol className="space-y-6">
          {lab.steps.map((step, i) => (
            <li key={i} className="flex gap-6 group">
              <span className="w-8 h-8 shrink-0 rounded-lg bg-[#2b2d30] border border-[#393b40] flex items-center justify-center text-sm font-bold text-[#3ddc84] group-hover:bg-[#3ddc84] group-hover:text-black transition-all">
                {i + 1}
              </span>
              <p className="text-[#bcbec4] text-lg leading-relaxed pt-1 select-text cursor-auto">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="p-6 bg-[#0d0d0d] border border-[#393b40] rounded-xl shadow-2xl">
        <h4 className="text-[10px] font-bold text-[#6f737a] mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
           <Activity className="w-3 h-3 text-[#3ddc84]" />
           Verification command
        </h4>
        <code className="text-sm font-mono text-[#3ddc84] block bg-black/40 p-3 rounded-lg border border-white/5">{lab.validation}</code>
      </div>
    </div>
  );
}

function DiagramRenderer({ id }: { id: string }) {
  const diagram = ARCHITECTURE_DIAGRAMS.find(d => d.id === id);
  if (!diagram) return <div>Diagram not found</div>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-4xl font-bold text-white mb-4 border-b border-[#393b40] pb-6">{diagram.title}</h2>
        <div className="flex gap-3">
          <span className="px-2 py-0.5 bg-[#2b2d30] border border-[#3ddc84] text-[#3ddc84] text-[10px] rounded uppercase font-bold tracking-tighter">Architecture Map</span>
          <span className="px-2 py-0.5 bg-[#2b2d30] border border-[#6f737a] text-[#bcbec4] text-[10px] rounded uppercase font-bold tracking-tighter">System Stack</span>
        </div>
      </div>
      <div className="bg-[#2b2d30] border border-[#393b40] rounded-2xl overflow-hidden p-8 shadow-2xl relative group">
        <div className="absolute top-4 right-4 text-[9px] font-mono text-[#6f737a] opacity-50 group-hover:opacity-100 transition-opacity">RENDERING_ENGINE: MERMAID_V10</div>
        <Mermaid chart={diagram.content} />
      </div>
      <div className="p-4 bg-[#3ddc84]/5 border border-[#3ddc84]/20 rounded-lg text-xs leading-relaxed text-[#bcbec4]">
        <p className="mb-2 italic text-[#3ddc84] font-bold">Interactive Navigation Instructions:</p>
        <ul className="list-disc ml-4 space-y-1">
          <li>Use the middle mouse button or scroll wheel to zoom into specific nodes for deep inspection.</li>
          <li>Hover over connection arrows to inspect theoretical Binder transaction payloads and latency projections.</li>
          <li>Double-click any node to jump to its corresponding source code definition in the Knowledge Base.</li>
        </ul>
      </div>
    </div>
  );
}

function LogcatAnalyzer() {
  const [filter, setFilter] = useState('');
  const [minLevel, setMinLevel] = useState<LogLevel>('V');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const levels: LogLevel[] = ['V', 'D', 'I', 'W', 'E', 'F'];
  const levelWeights: Record<LogLevel, number> = { 'V': 0, 'D': 1, 'I': 2, 'W': 3, 'E': 4, 'F': 5 };

  const filteredLogs = SAMPLE_LOGS.filter(log => {
    const matchesFilter = log.tag.toLowerCase().includes(filter.toLowerCase()) || 
                         log.message.toLowerCase().includes(filter.toLowerCase());
    const matchesLevel = levelWeights[log.level] >= levelWeights[minLevel];
    return matchesFilter && matchesLevel;
  });

  const explainLog = async (log: LogEntry) => {
    setSelectedLog(log);
    setAiExplanation(null);
    setAiLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `Explain this Android Logcat entry. What does it mean in the context of AOSP development? Log: [${log.level}/${log.tag}] ${log.message}` }] }
        ],
        config: {
          systemInstruction: "You are an expert AOSP platform engineer. You provide concise, deeply technical explanations for Logcat entries, pointing out common causes and debugging tips."
        }
      });
      setAiExplanation(response.text || "Could not generate explanation.");
    } catch (error) {
       setAiExplanation("Error: Could not connect to AI Mentor.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
      <div className="flex items-center justify-between mb-6 border-b border-[#393b40] pb-4 shrink-0">
        <h2 className="text-3xl font-bold text-white">Logcat Analyzer</h2>
        <div className="flex gap-4">
          <div className="flex items-center bg-[#2b2d30] border border-[#393b40] rounded px-2 py-1 gap-2">
            <Search className="w-3.5 h-3.5 text-[#6f737a]" />
            <input 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter by tag or message..." 
              className="bg-transparent text-xs text-white focus:outline-none w-48"
            />
          </div>
          <select 
            value={minLevel}
            onChange={e => setMinLevel(e.target.value as LogLevel)}
            className="bg-[#2b2d30] border border-[#393b40] rounded px-2 py-1 text-xs text-white focus:outline-none"
          >
            {levels.map(l => <option key={l} value={l}>{l} (Level {levelWeights[l]})</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 bg-[#0d0d0d] border border-[#393b40] rounded-lg overflow-hidden flex flex-col font-mono text-[11px]">
          <div className="grid grid-cols-[140px_40px_100px_1fr] gap-2 px-3 py-2 bg-[#2b2d30] border-b border-[#393b40] text-[#6f737a] font-bold uppercase tracking-tighter">
            <div>Timestamp</div>
            <div>Lvl</div>
            <div>Tag</div>
            <div>Message</div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-dark">
            {filteredLogs.map(log => (
              <div 
                key={log.id} 
                onClick={() => explainLog(log)}
                className={cn(
                  "grid grid-cols-[140px_40px_100px_1fr] gap-2 px-3 py-1 cursor-pointer transition-colors border-b border-white/[0.02]",
                  selectedLog?.id === log.id ? "bg-[#393b40] text-white" : "hover:bg-white/[0.05]",
                  log.level === 'E' || log.level === 'F' ? "text-red-400" : 
                  log.level === 'W' ? "text-yellow-400" : "text-[#bcbec4]"
                )}
              >
                <div className="opacity-50">{log.timestamp}</div>
                <div className="font-bold">{log.level}</div>
                <div className="font-bold truncate">{log.tag}</div>
                <div className="truncate group relative" title={log.message}>{log.message}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 bg-[#2b2d30] border border-[#393b40] rounded-lg flex flex-col overflow-hidden shadow-2xl">
          <div className="p-3 border-b border-[#393b40] bg-[#1e1f22] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#3ddc84]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6f737a]">Entry Analysis</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {selectedLog ? (
              <>
                <div className="space-y-1">
                  <div className="text-[9px] text-[#6f737a] uppercase font-bold">Log Identity</div>
                  <div className="text-xs font-mono text-white bg-black/30 p-2 rounded border border-white/5">
                    PID: {selectedLog.pid} | TID: {selectedLog.tid}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] text-[#6f737a] uppercase font-bold">AI Insight</div>
                  <div className="bg-[#1e1f22] rounded-lg p-3 border border-[#3ddc84]/20 min-h-[100px]">
                    {aiLoading ? (
                      <div className="flex items-center gap-2 text-[10px] text-[#3ddc84] animate-pulse h-full">
                        <Cpu className="w-3 h-3 spin" />
                        DECODING_SYSTEM_EVENT...
                      </div>
                    ) : aiExplanation ? (
                      <div className="markdown-body prose prose-invert prose-xs leading-normal">
                        <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-[10px] text-[#6f737a] italic text-center pt-8">
                        Select a log entry to generate an AI-powered explanation.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center px-4">
                <TerminalIcon className="w-12 h-12 mb-4" />
                <p className="text-xs italic">Select a log entry from the list to reveal deep platform insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AiMentorPanel({ currentContext }: { currentContext?: Tab }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hello! I'm your AOSP Mentor. I'm here to help you understand Android platform internals, debug build failures, or explain complex architecture. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are a world-class AOSP platform engineer. Context: current tab is ${currentContext?.title}. User asks: ${userMessage}` }] }
        ],
        config: {
          systemInstruction: "You are an expert in Android Open Source Project (AOSP) internals. You explain complex topics like Binder, HAL, ART, and AAOS clearly and deeply. You always provide code snippets or adb commands where relevant."
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI mentor. Please check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#2b2d30]">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-dark">
        {messages.map((m, i) => (
          <div key={i} className={cn("text-[11px] leading-relaxed", m.role === 'user' ? "text-white" : "text-[#bcbec4]")}>
            <div className="flex items-center gap-2 mb-2 opacity-50 uppercase font-black text-[8px] tracking-widest">
              {m.role === 'assistant' ? <div className="w-1.5 h-1.5 bg-[#3ddc84] rounded-full"></div> : <Code className="w-3 h-3" />}
              {m.role === 'assistant' ? 'AOSP Mentor' : 'Engineer'}
            </div>
            <div className={cn("p-3 rounded-lg border", m.role === 'user' ? "bg-[#393b40] border-[#4e5157]" : "bg-[#1e1f22] border-[#3ddc84]/20 shadow-inner")}>
               <div className="markdown-body prose prose-invert prose-xs leading-normal">
                 <ReactMarkdown>{m.content}</ReactMarkdown>
               </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-[9px] text-[#3ddc84] font-bold animate-pulse px-2">
            <Cpu className="w-3 h-3 spin" />
            SYNCHRONIZING_WITH_KNOWLEDGE_GRAPH...
          </div>
        )}
      </div>
      <div className="p-4 border-t border-[#393b40] bg-[#2b2d30]">
        <div className="flex bg-[#1e1f22] border border-[#4e5157] rounded-md p-0.5 shadow-inner group focus-within:border-[#3ddc84] transition-colors">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask AOSP Mentor..." 
            className="flex-1 bg-transparent px-3 py-2 text-[11px] text-white focus:outline-none placeholder-[#6f737a]"
          />
          <button 
            onClick={sendMessage}
            disabled={loading}
            className="px-3 text-[#6f737a] hover:text-[#3ddc84] transition-colors disabled:opacity-30"
          >
            <kbd className="bg-[#393b40] text-[9px] px-1.5 py-0.5 rounded text-[#bcbec4]">↵</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
