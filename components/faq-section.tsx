import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"

export function FAQSection() {
  return (
    <section className="bg-muted/30 py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="relative h-[500px] w-full max-w-md overflow-hidden rounded-3xl">
                <Image
                            src={'/image/logsImg.png'}
                           width={100}
                           height={100}
                           alt="Logo"
                           className="h-full w-full object-cover"
                           />
              </div>
            </div>

            <div>
              <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-left">
                Questions & Answers
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="rounded-2xl border-2 border-primary bg-primary px-6">
                  <AccordionTrigger className="text-left font-semibold text-primary-foreground hover:no-underline">
                    Is it safe to buy social media accounts from Rediprofiles?
                  </AccordionTrigger>
                  <AccordionContent className="text-primary-foreground/90">
                    Yes, all accounts on Rediprofiles are verified and security-checked before delivery. We ensure safe
                    transfers so you can use your new account with confidence.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="rounded-2xl border-2 bg-white px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    How long does it take to receive my account after payment?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Delivery is instant. As soon as your payment is confirmed, account details are sent to you
                    immediately.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="rounded-2xl border-2 bg-white px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    What happens if I don't check my account right away?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    You are required to review your account within 30 minutes of delivery. If no issues are reported
                    within that time, the account is considered accepted and no refunds will be issued.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="rounded-2xl border-2 bg-white px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Can I resell the accounts I buy from Rediprofiles?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes. With our reseller system, you can start reselling accounts with zero capital. We supply the
                    accounts, you set your prices, and keep the profit.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="rounded-2xl border-2 bg-white px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    What payment methods does Rediprofiles accept?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    We accept payments through secure methods including debit/credit cards, wallet deposits, and
                    cryptocurrency. All payments are processed safely to protect our clients.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="rounded-2xl border-2 bg-white px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    What is the Rediprofiles pre-order system?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our pre-order system allows you to place an order even when stock shows zero. Once new accounts are
                    added, your order is fulfilled automatically — no need to wait or search.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-12 flex justify-center lg:hidden">
                <div className="relative h-64 w-64 overflow-hidden rounded-3xl">
                 <Image
                            src={'/image/logsImg.png'}
                           width={100}
                           height={100}
                           alt="Logo"
                           className="h-full w-full object-cover"
                           />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
