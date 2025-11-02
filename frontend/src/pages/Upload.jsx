import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { uploadAPI } from '@/services/api'
import { formatBytes } from '@/lib/utils'
import { Upload as UploadIcon, File, CheckCircle, AlertCircle } from 'lucide-react'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState(null)
  
  const navigate = useNavigate()
  const { toast } = useToast()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        setUploadResult(null)
      }
    }
  })

  const handleUpload = async () => {
    if (!file) {
      toast({ title: 'Error', description: 'Please select a file', variant: 'destructive' })
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const response = await uploadAPI.upload(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setProgress(percentCompleted)
      })

      setUploadResult(response.data)
      toast({ title: 'Success', description: 'File uploaded successfully!' })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Upload failed',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Upload Dataset</h1>
        <p className="text-muted-foreground mt-2">
          Upload your semiconductor manufacturing data for analysis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Supported formats: CSV, XLS, XLSX (Max 1GB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop a file here, or click to select</p>
                <p className="text-sm text-muted-foreground">CSV, XLS, XLSX files accepted</p>
              </div>
            )}
          </div>

          {/* Selected File */}
          {file && (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-accent">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFile(null)}
              >
                Remove
              </Button>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Upload Successful!
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Rows:</span> {uploadResult.rows}</div>
                    <div><span className="text-muted-foreground">Columns:</span> {uploadResult.columns}</div>
                    <div><span className="text-muted-foreground">Numerical:</span> {uploadResult.numerical_cols.length}</div>
                    <div><span className="text-muted-foreground">Categorical:</span> {uploadResult.categorical_cols.length}</div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" onClick={() => navigate(`/eda/${uploadResult.upload_id}`)}>
                      Start EDA
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/ml/${uploadResult.upload_id}`)}>
                      Train Model
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? 'Uploading...' : 'Upload & Analyze'}
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Data Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <p className="text-sm">CSV, XLS, or XLSX format with column headers</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <p className="text-sm">Numerical features for ML and EDA analysis</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <p className="text-sm">Minimum 100 rows recommended for accurate analysis</p>
          </div>
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <p className="text-sm">Missing values will be handled automatically</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

