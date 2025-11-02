import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { edaAPI } from '@/services/api'
import { BarChart3, TrendingUp, AlertCircle, Loader2 } from 'lucide-react'

export default function EDA() {
  const { uploadId } = useParams()
  const { toast } = useToast()
  const [edaResults, setEdaResults] = useState(null)

  const generateEDA = useMutation({
    mutationFn: () => edaAPI.generateSummary(uploadId),
    onSuccess: (response) => {
      setEdaResults(response.data)
      toast({ title: 'Success', description: 'EDA analysis completed!' })
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'EDA analysis failed', variant: 'destructive' })
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exploratory Data Analysis</h1>
          <p className="text-muted-foreground mt-2">Dataset ID: {uploadId}</p>
        </div>
        <Button onClick={() => generateEDA.mutate()} disabled={generateEDA.isPending}>
          {generateEDA.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
          Generate EDA
        </Button>
      </div>

      {edaResults && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Mean, Median, Std, Min, Max computed for all numerical features</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Correlation Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Pearson correlation between features</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Outliers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{edaResults.outliers?.total_outliers || 0}</p>
                <p className="text-sm text-muted-foreground">Total outliers detected</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {edaResults.insights?.map((insight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {edaResults.recommendations?.map((rec, index) => (
                  <li key={index} className="text-sm">• {rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

