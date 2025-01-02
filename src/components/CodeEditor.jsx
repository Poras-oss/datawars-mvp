import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'

function CodeEditor({ value, onChange, language, theme = 'vs-dark' }) {
  const editorRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    editorRef.current = monaco.editor.create(containerRef.current, {
      value,
      language,
      theme,
      minimap: { enabled: false },
      automaticLayout: true,
      fontSize: 14,
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      tabSize: 2,
      fontFamily: 'JetBrains Mono, monospace',
    })

    editorRef.current.onDidChangeModelContent(() => {
      onChange(editorRef.current.getValue())
    })

    return () => {
      editorRef.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel()
      if (model) monaco.editor.setModelLanguage(model, language)
      editorRef.current.updateOptions({ theme })
    }
  }, [language, theme])

  return (
    <div ref={containerRef} className="h-full w-full" />
  )
}

export default CodeEditor

