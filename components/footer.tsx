import { Music, Send, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Top Text */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium mb-6">
              © 2025 Rediprofiles LTD. All rights reserved.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col items-center justify-center text-sm text-muted-foreground gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
            <a href="#" className="hover:text-foreground transition-colors text-center w-full sm:w-auto">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors text-center w-full sm:w-auto">
              Terms and Conditions
            </a>
            <a href="#" className="hover:text-foreground transition-colors text-center w-full sm:w-auto">
              Terms of Use
            </a>
            <a href="#" className="hover:text-foreground transition-colors text-center w-full sm:w-auto">
              Rules & FAQs
            </a>
          </div>

         
        </div>
      </div>
    </footer>
  )
}
