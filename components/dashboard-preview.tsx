import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, ChevronRight, Instagram } from "lucide-react"

export function DashboardPreview() {
  return (
    <section className="container px-4 pb-12 md:px-6 md:pb-20">
      <div className="mx-auto max-w-2xl">
        <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-xl">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="mb-6 text-center text-xl font-semibold text-foreground">Order received</h3>
            <Button variant="outline" className="mb-6 w-full justify-between rounded-xl border-2 bg-transparent">
              View details
              <ChevronRight className="h-5 w-5" />
            </Button>

            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground">Order / Order Platform</div>

              {[
                {
                  name: "Instagram",
                  followers: "100k",
                  status: "Verify",
                  statusColor: "bg-green-100 text-green-700",
                },
                {
                  name: "Instagram Accounts",
                  followers: "100k followers",
                  status: "Verify",
                  statusColor: "bg-green-100 text-green-700",
                },
                {
                  name: "Instagram Accounts",
                  followers: "100k followers",
                  status: "Active",
                  statusColor: "bg-green-100 text-green-700",
                },
                {
                  name: "Instagram Accounts",
                  followers: "100k followers",
                  status: "Active",
                  statusColor: "bg-green-100 text-green-700",
                },
              ].map((account, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
                      <Instagram className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{account.name}</div>
                      <div className="text-xs text-muted-foreground">{account.followers}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${account.statusColor}`}>
                      {account.status}
                    </span>
                    <Button size="sm" className="h-7 rounded-full bg-primary px-4 text-xs">
                      Action
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
