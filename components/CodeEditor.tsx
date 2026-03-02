'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/hooks/useTheme';

interface CodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    onChange,
    language = 'java',
    readOnly = false,
}) => {
    const { theme } = useTheme();

    return (
        <div className="flex-1 w-full h-full overflow-hidden border border-gray-200 dark:border-[#3c3c3c] rounded-md shadow-inner transition-colors duration-300">
            <Editor
                height="100%"
                width="100%"
                language={language}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={value}
                onChange={onChange}
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    quickSuggestions: true,
                    padding: { top: 16, bottom: 16 },
                }}
                loading={<div className="flex items-center justify-center h-full text-gray-400">Loading editor...</div>}
            />
        </div>
    );
};

export default CodeEditor;
