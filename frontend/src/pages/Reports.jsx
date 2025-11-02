import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useToast } from '../components/ui/use-toast'
import { reportAPI, uploadAPI } from '../services/api'
import { FileText, Download, Loader2, Trash2 } from 'lucide-react'

export default function Reports() {
  const { toast } = useToast()
  const [selectedUpload, setSelectedUpload] = useState('')

  const { data: uploads } = useQuery({
    queryKey: ['uploads'],
    queryFn: async () => {
      const response = await uploadAPI.getHistory()
      return response.data
    }
  })

  const { data: reports, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await reportAPI.list()
      return response.data
    }
  })

  const generateReport = useMutation({
    mutationFn: (uploadId) => reportAPI.generate(uploadId, true, true, true, true),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Report generation started!' })
      refetch()
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to generate report', variant: 'destructive' })
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-2">Generate and download comprehensive PDF reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <select
              className="w-full p-2 border rounded-md"
              value={selectedUpload}
              onChange={(e) => setSelectedUpload(e.target.value)}
            >
              <option value="">Select a dataset...</option>
              {uploads?.map((upload) => (
                <option key={upload.id} value={upload.id}>
                  {upload.filename}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => generateReport.mutate(selectedUpload)}
            disabled={!selectedUpload || generateReport.isPending}
          >
            {generateReport.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            Generate PDF Report
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports && reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Report {report.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No reports generated yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

