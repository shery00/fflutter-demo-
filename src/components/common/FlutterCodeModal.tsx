import React, { useState } from 'react';
import { X, Copy, Check, Download, FolderTree, FileCode, ExternalLink, Terminal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FLUTTER_CODEBASE, FlutterFile } from '../../flutter_export/flutterCodeData';
import { downloadFlutterProjectZip } from '../../flutter_export/downloadZip';

export const FlutterCodeModal: React.FC = () => {
  const {
    showFlutterInspector,
    setShowFlutterInspector,
    activeFlutterFileId,
    setActiveFlutterFileId
  } = useApp();

  const [copied, setCopied] = useState<boolean>(false);

  if (!showFlutterInspector) return null;

  const activeFile = FLUTTER_CODEBASE.find(f => f.id === activeFlutterFileId) || FLUTTER_CODEBASE[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.path.split('/').pop() || 'flutter_code.dart';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const categories = [
    { id: 'build_apk', name: '⚡ Smallest APK (13.8MB) Config' },
    { id: 'config', name: 'Configuration & Routing' },
    { id: 'theme', name: 'Material 3 Theme' },
    { id: 'models', name: 'Data Models' },
    { id: 'widgets', name: 'Shared UI Components' },
    { id: 'screens', name: 'Screens (6 Full Screens)' },
    { id: 'main', name: 'Application Entrypoint' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              FL
            </div>
            <div>
              <h2 className="text-base font-bold font-['Poppins'] text-white flex items-center gap-2">
                Flutter Material 3 Code Inspector
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Dart 3.3+ · Riverpod · GoRouter
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Production-grade architecture with null safety, 60fps animations & Polish kebab localization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadFlutterProjectZip()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors"
              title="Pobierz cały projekt w pliku .ZIP (Download full Flutter project .zip)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz cały projekt (.ZIP)</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
              title="Pobierz ten plik"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ten plik</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Skopiowano!' : 'Kopiuj kod'}</span>
            </button>
            <button
              onClick={() => setShowFlutterInspector(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors ml-2"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-64 sm:w-72 border-r border-stone-800 bg-stone-950/50 flex flex-col shrink-0">
            <div className="p-3 border-b border-stone-800/80 flex items-center gap-2 text-xs font-semibold text-stone-400">
              <FolderTree className="w-4 h-4 text-orange-500" />
              <span>Struktura projektu (lib/)</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
              {categories.map(cat => {
                const files = FLUTTER_CODEBASE.filter(f => f.category === cat.id);
                if (files.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-1">
                    <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      {cat.name}
                    </span>
                    <div className="space-y-0.5">
                      {files.map(file => {
                        const isSelected = file.id === activeFile.id;
                        return (
                          <button
                            key={file.id}
                            onClick={() => setActiveFlutterFileId(file.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                              isSelected
                                ? 'bg-orange-600/20 text-orange-400 font-semibold border border-orange-500/30'
                                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                            }`}
                          >
                            <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-orange-400' : 'text-stone-500'}`} />
                            <span className="truncate">{file.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick stats box */}
            <div className="p-3 border-t border-stone-800 text-[11px] text-stone-400 bg-stone-950/90">
              <div className="flex justify-between py-0.5">
                <span>Material 3 Target:</span>
                <span className="text-white font-mono">Flutter 3.22+</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>State Engine:</span>
                <span className="text-orange-400 font-mono">Riverpod 2.5</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Router:</span>
                <span className="text-emerald-400 font-mono">GoRouter 14</span>
              </div>
            </div>
          </div>

          {/* Main Code View */}
          <div className="flex-1 flex flex-col bg-[#151518] overflow-hidden">
            {/* File Info Bar */}
            <div className="px-5 py-2.5 border-b border-stone-800 flex items-center justify-between bg-stone-900/60">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-mono text-xs text-orange-400 font-semibold">{activeFile.path}</span>
                <span className="text-stone-500 text-xs hidden md:inline">·</span>
                <span className="text-xs text-stone-400 truncate hidden md:inline">{activeFile.description}</span>
              </div>
              <div className="text-[11px] text-stone-500 font-mono whitespace-nowrap pl-2">
                {activeFile.code.split('\n').length} linii
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-5 font-mono text-xs leading-relaxed selection:bg-orange-600/30">
              <pre className="text-stone-300">
                <code>{activeFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
