import { DollarSign, Users, Cpu, Clock } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-12 md:py-20 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-background p-8 shadow-lg md:p-12 lg:p-16">
          <div className="mb-12 text-center lg:mb-16">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              What Sets Us Apart
            </h2>
            <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
              Discover the unique advantages that make Rediprofiles the preferred choice for social media accounts
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <DollarSign className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">1. Cheapest With the Best Value</h3>
              <p className="text-pretty text-muted-foreground">
                We offer the most affordable accounts in the market while maintaining strict verification and security.
              </p>
            </div>

            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">2. Reseller System – Start With Zero Capital</h3>
              <p className="text-pretty text-muted-foreground">
                Anyone can start reselling accounts with us at no upfront cost. We provide the accounts, you set the
                price, and keep the profit.
              </p>
            </div>

            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Cpu className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">3. Child Panel System</h3>
              <p className="text-pretty text-muted-foreground">
                Agencies and bulk buyers can run their own branded panel under our infrastructure, while we handle the
                backend — fast, secure, and scalable.
              </p>
            </div>

            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">4. Pre-Order System</h3>
              <p className="text-pretty text-muted-foreground">
                Even when stock shows zero, you can place pre-orders and get automatic delivery the moment accounts are
                restocked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
