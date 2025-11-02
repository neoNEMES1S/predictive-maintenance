import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { mlAPI } from '@/services/api'
import { Brain, Loader2, TrendingUp } from 'lucide-react'

export default function MachineLearning() {
  const { uploadId } = useParams()
  const { toast } = useToast()
  const [targetColumn, setTargetColumn] = useState('failure_mode')
  const [jobId, setJobId] = useState(null)

  const trainModel = useMutation({
    mutationFn: () => mlAPI.train(uploadId, targetColumn, null, 0.2, ['xgboost', 'lightgbm', 'rf', 'catboost']),
    onSuccess: (response) => {
      setJobId(response.data.job_id)
      toast({ title: 'Success', description: 'Model training started!' })
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to start training', variant: 'destructive' })
    }
  })

  const { data: status } = useQuery({
    queryKey: ['mlStatus', jobId],
    queryFn: () => mlAPI.getStatus(jobId),
    enabled: !!jobId,
    refetchInterval: 3000
  })

  const { data: results } = useQuery({
    queryKey: ['mlResults', jobId],
    queryFn: () => mlAPI.getResults(jobId),
    enabled: status?.data?.status === 'completed'
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Machine Learning</h1>
        <p className="text-muted-foreground mt-2">Train predictive models on your data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Train Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target Column</Label>
            <Input
              id="target"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              placeholder="e.g., failure_mode, quality_score"
            />
            <p className="text-xs text-muted-foreground">
              The column you want to predict
            </p>
          </div>

          <Button onClick={() => trainModel.mutate()} disabled={trainModel.isPending || !!jobId}>
            {trainModel.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
            Train Models (XGBoost, LightGBM, RF, CatBoost)
          </Button>

          {status && (
            <div className="mt-4 p-4 border rounded-lg">
              <p className="font-semibold">Status: {status.data.status}</p>
              <p className="text-sm text-muted-foreground">Progress: {status.data.progress}%</p>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${status.data.progress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{results.data.best_model}</p>
                <p className="text-sm text-muted-foreground">Score: {results.data.best_score.toFixed(4)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{(results.data.metrics.accuracy * 100).toFixed(2)}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>F1 Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{results.data.metrics.f1_score.toFixed(4)}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Feature Importance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(results.data.feature_importance).slice(0, 10).map(([feature, importance]) => (
                  <div key={feature} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{feature}</span>
                      <span className="font-semibold">{importance.toFixed(4)}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${importance * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

