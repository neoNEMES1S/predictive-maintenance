import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadAPI } from '../services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useToast } from '../components/ui/use-toast'
import { 
  UploadCloud, 
  Database, 
  BarChart3, 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  FileText,
  Calendar,
  Layers
} from 'lucide-react'

export default function Dashboard() {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    fetchUploads()
  }, [])

  const fetchUploads = async () => {
    try {
      const response = await uploadAPI.getHistory()
      setUploads(response.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load uploads',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = [
    { title: 'Total Datasets', value: uploads.length, icon: Database, color: 'text-blue-600' },
    { title: 'Total Records', value: uploads.reduce((acc, u) => acc + (u.rows || 0), 0).toLocaleString(), icon: Layers, color: 'text-green-600' },
    { title: 'Analyses', value: uploads.length * 4, icon: BarChart3, color: 'text-purple-600' },
    { title: 'Models Trained', value: uploads.length > 0 ? uploads.length : 0, icon: Brain, color: 'text-orange-600' },
  ]

  const quickActions = [
    { title: 'Upload Data', description: 'Upload new semiconductor data', icon: UploadCloud, path: '/upload', color: 'bg-blue-50 text-blue-600' },
    { title: 'EDA Analysis', description: 'Exploratory data analysis', icon: BarChart3, path: '/eda', color: 'bg-purple-50 text-purple-600', disabled: uploads.length === 0 },
    { title: 'Train ML Model', description: 'Train predictive models', icon: Brain, path: '/ml', color: 'bg-green-50 text-green-600', disabled: uploads.length === 0 },
    { title: 'Anomaly Detection', description: 'Detect outliers and anomalies', icon: AlertTriangle, path: '/anomaly', color: 'bg-orange-50 text-orange-600', disabled: uploads.length === 0 },
    { title: 'Optimization', description: 'Optimize process parameters', icon: TrendingUp, path: '/optimization', color: 'bg-indigo-50 text-indigo-600', disabled: uploads.length === 0 },
    { title: 'Generate Reports', description: 'Create comprehensive reports', icon: FileText, path: '/reports', color: 'bg-pink-50 text-pink-600', disabled: uploads.length === 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your semiconductor data analysis</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-md transition-shadow ${action.disabled ? 'opacity-50' : ''}`}
              onClick={() => !action.disabled && navigate(action.path)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Uploads</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/upload')}>
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Loading...</p>
            </CardContent>
          </Card>
        ) : uploads.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data uploaded yet</h3>
                <p className="text-gray-500 mb-4">Get started by uploading your first dataset</p>
                <Button onClick={() => navigate('/upload')}>
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Upload Data
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {uploads.slice(0, 5).map((upload) => (
              <Card key={upload.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Database className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{upload.filename}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Layers className="h-4 w-4 mr-1" />
                            {upload.rows?.toLocaleString()} rows × {upload.columns} columns
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(upload.uploaded_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/eda?upload=${upload.id}`)}
                      >
                        Analyze
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/ml?upload=${upload.id}`)}
                      >
                        Train Model
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
