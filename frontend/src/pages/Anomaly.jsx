import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { anomalyAPI } from '@/services/api'
import { AlertTriangle, Loader2 } from 'lucide-react'

export default function Anomaly() {
  const { uploadId } = useParams()
  const { toast } = useToast()
  const [method, setMethod] = useState('isolation_forest')
  const [results, setResults] = useState(null)

  const detectAnomalies = useMutation({
    mutationFn: () => anomalyAPI.run(uploadId, method, 0.1),
    onSuccess: (response) => {
      setResults(response.data)
      toast({ title: 'Success', description: 'Anomaly detection completed!' })
    },
    onError: () => {
      toast({ title: 'Error', description: 'Anomaly detection failed', variant: 'destructive' })
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Anomaly Detection</h1>
        <p className="text-muted-foreground mt-2">Detect outliers and unusual patterns</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Detection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Method</Label>
            <div className="flex space-x-2">
              <Button
                variant={method === 'isolation_forest' ? 'default' : 'outline'}
                onClick={() => setMethod('isolation_forest')}
              >
                Isolation Forest
              </Button>
              <Button
                variant={method === 'dbscan' ? 'default' : 'outline'}
                onClick={() => setMethod('dbscan')}
              >
                DBSCAN
              </Button>
            </div>
          </div>

          <Button onClick={() => detectAnomalies.mutate()} disabled={detectAnomalies.isPending}>
            {detectAnomalies.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
            Detect Anomalies
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Anomalies Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">{results.anomaly_count}</p>
                <p className="text-sm text-muted-foreground">{results.anomaly_percentage.toFixed(2)}% of data</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Method Used</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{results.method}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Normal Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{results.summary.normal_count}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-x-2">
              <Button variant="outline">Export Anomalies</Button>
              <Button variant="outline">Visualize</Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

