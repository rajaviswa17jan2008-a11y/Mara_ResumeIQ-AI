import React, { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { resumeAPI } from '../services/api'
import { aiAPI } from '../services/aiApi'

const ResumeContext = createContext(null)

export const useResume = () => {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes]               = useState([])
  const [activeResume, setActiveResume]     = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analyzing, setAnalyzing]           = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [skillRecs, setSkillRecs]           = useState([])
  const [jobMatches, setJobMatches]         = useState([])

  const uploadResume = useCallback(async (file, onProgress) => {
  const formData = new FormData()
  formData.append('resume', file)

  try {
    const { data } = await resumeAPI.upload(formData, (pct) => {
      setUploadProgress(pct)
      onProgress?.(pct)
    })

    console.log("UPLOAD API RESPONSE:", data)

    setResumes(prev => [data, ...prev])
    setActiveResume(data)

    localStorage.setItem(
      "resumeData",
      JSON.stringify(data)
    )

    toast.success('Resume uploaded successfully!')

    return {
      success: true,
      resume: data
    }

  } catch (err) {
    console.log(err)

    toast.error(
      err.response?.data?.message || 'Upload failed'
    )

    return { success: false }

  } finally {
    setUploadProgress(0)
  }
}, [])

  const analyzeResume = useCallback(async (resumeId, jobTitle = '') => {
    setAnalyzing(true)
    try {
      const { data } = await aiAPI.analyzeResume({ resumeId, jobTitle })
      setAnalysisResult(data)
      toast.success('AI analysis complete! 🤖')
      return data
    } catch (err) {
      toast.error('Analysis failed. Please try again.')
      return null
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const getSkillRecommendations = useCallback(async (resumeId, targetRole = '') => {
    try {
      const { data } = await aiAPI.getSkillRecommendations({ resumeId, targetRole })
      setSkillRecs(data.recommendations)
      return data.recommendations
    } catch (err) {
      toast.error('Failed to get skill recommendations')
      return []
    }
  }, [])

  const getJobMatches = useCallback(async (resumeId) => {
    try {
      const { data } = await aiAPI.getJobMatches({ resumeId })
      setJobMatches(data.jobs)
      return data.jobs
    } catch (err) {
      toast.error('Failed to fetch job matches')
      return []
    }
  }, [])

  const fetchResumes = useCallback(async () => {
    try {
      const { data } = await resumeAPI.getAll()
      setResumes(data.resumes)
    } catch {/* silent */}
  }, [])

  const deleteResume = useCallback(async (resumeId) => {
    try {
      await resumeAPI.delete(resumeId)
      setResumes(prev => prev.filter(r => r._id !== resumeId))
      if (activeResume?._id === resumeId) setActiveResume(null)
      toast.success('Resume deleted')
    } catch {
      toast.error('Failed to delete resume')
    }
  }, [activeResume])

  return (
    <ResumeContext.Provider value={{
      resumes, activeResume, analysisResult, analyzing,
      uploadProgress, skillRecs, jobMatches,
      setActiveResume, setAnalysisResult,
      uploadResume, analyzeResume, getSkillRecommendations,
      getJobMatches, fetchResumes, deleteResume,
    }}>
      {children}
    </ResumeContext.Provider>
  )
}