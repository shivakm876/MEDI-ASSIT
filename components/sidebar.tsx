"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { signOut } from "next-auth/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Stethoscope, History, User, Settings, LogOut, ChevronUp, MessageCircle, BookOpen, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useUser } from "@/lib/user-context"

export default function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { t } = useLanguage()
  const { setOpenMobile } = useSidebar()
  const { data: session } = useSession()
  const { userName } = useUser()

  const navigation = [ 
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Symptom Checker",
          url: "/disease-predictor",
          icon: Stethoscope,
        },
        {
          title: "Symptom History",
          url: "/symptom-history",
          icon: History,
        },
        {
          title: "Chat Assistant",
          url: "/followup-chatbot",
          icon: MessageCircle,
        },
        // {
        //   title: "Medical Search",
        //   url: "/book-chatbot",
        //   icon: BookOpen,
        // },
        {
          title: "Find Doctors",
          url: "/find-doctors",
          icon: Search,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          url: "/profile",
          icon: User,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ],
    },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <Sidebar variant="inset" className="bg-card border-r">
      <SidebarHeader className="border-b bg-card">
        <div className="flex items-center justify-between gap-2 px-2 sm:px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white sm:w-4 sm:h-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <span className="font-bold text-base sm:text-lg text-card-foreground">MediAssist</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 text-muted-foreground hover:text-card-foreground hover:bg-accent"
            onClick={() => setOpenMobile(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-card">
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs sm:text-sm text-muted-foreground">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.url} 
                      size="default" 
                      className="text-sm sm:text-base text-muted-foreground hover:text-card-foreground hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-card-foreground"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t bg-card">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="text-muted-foreground hover:text-card-foreground hover:bg-accent data-[state=open]:bg-accent data-[state=open]:text-card-foreground"
                >
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg border">
                    {/* <AvatarImage
                      src={session?.user?.image || "/placeholder.svg?height=32&width=32"}
                      alt={userName || session?.user?.name || "User"}
                    /> */}
                    <AvatarFallback className="rounded-lg bg-accent text-accent-foreground">
                      {userName?.[0] || session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs sm:text-sm leading-tight">
                    <span className="truncate font-semibold text-card-foreground">{userName || session?.user?.name || "User"}</span>
                    <span className="truncate text-[10px] sm:text-xs text-muted-foreground">{session?.user?.email || "user@example.com"}</span>
                  </div>
                  <ChevronUp className="ml-auto size-3 sm:size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border bg-popover text-popover-foreground"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 text-popover-foreground hover:bg-accent">
                    <User className="h-4 w-4" />
                    {t("profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 text-popover-foreground hover:bg-accent">
                    <Settings className="h-4 w-4" />
                    {t("settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                  {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
