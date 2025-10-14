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
          <div className="flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <span className="hidden sm:block">•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms and Conditions
            </a>
            <span className="hidden sm:block">•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Use
            </a>
            <span className="hidden sm:block">•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Rules & FAQs
            </a>
          </div>

        
        </div>
      </div>
    </footer>
  )
}
