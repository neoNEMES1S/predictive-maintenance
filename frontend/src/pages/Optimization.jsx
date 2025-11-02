import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { optimizationAPI } from '@/services/api'
import { Settings, Loader2, TrendingUp } from 'lucide-react'

export default function Optimization() {
  const { uploadId } = useParams()
  const { toast } = useToast()
  const [targetColumn, setTargetColumn] = useState('quality_score')
  const [goal, setGoal] = useState('maximize')
  const [results, setResults] = useState(null)

  const optimize = useMutation({
    mutationFn: () => optimizationAPI.run(uploadId, targetColumn, goal),
    onSuccess: (response) => {
      setResults(response.data)
      toast({ title: 'Success', description: 'Optimization completed!' })
    },
    onError: () => {
      toast({ title: 'Error', description: 'Optimization failed', variant: 'destructive' })
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Parameter Optimization</h1>
        <p className="text-muted-foreground mt-2">Find optimal parameter ranges</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target Column</Label>
            <Input
              id="target"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Goal</Label>
            <div className="flex space-x-2">
              <Button
                variant={goal === 'maximize' ? 'default' : 'outline'}
                onClick={() => setGoal('maximize')}
              >
                Maximize
              </Button>
              <Button
                variant={goal === 'minimize' ? 'default' : 'outline'}
                onClick={() => setGoal('minimize')}
              >
                Minimize
              </Button>
            </div>
          </div>

          <Button onClick={() => optimize.mutate()} disabled={optimize.isPending}>
            {optimize.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
            Optimize Parameters
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Improvement Potential
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {results.current_vs_optimal.improvement_potential.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                From {results.current_vs_optimal.current_target_mean.toFixed(2)} → {results.current_vs_optimal.optimal_target_mean.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">• {rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimal Parameter Ranges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results.optimal_ranges).slice(0, 5).map(([param, ranges]) => (
                  <div key={param} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{param}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Optimal Mean:</span> {ranges.mean.toFixed(2)}</div>
                      <div><span className="text-muted-foreground">Current Mean:</span> {ranges.current_mean.toFixed(2)}</div>
                      <div><span className="text-muted-foreground">Range:</span> {ranges.min.toFixed(2)} - {ranges.max.toFixed(2)}</div>
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

