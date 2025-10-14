import { Home, FolderOpen, MapPin, FileText, Settings, Search, Plus } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import effathaLogo from "@/assets/effatha-logo.png";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Projetos", url: "/projetos", icon: FolderOpen },
  { title: "Áreas", url: "/areas", icon: MapPin },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (active: boolean) =>
    active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="px-2 py-4">
        <div className={`mb-6 ${collapsed ? "px-1" : "px-3"}`}>
          <img 
            src={effathaLogo} 
            alt="Effatha" 
            className={`w-full h-auto ${collapsed ? "max-w-[40px]" : "max-w-[180px]"}`}
          />
        </div>

        <div className="mb-4 px-2">
          <Button 
            onClick={() => navigate("/projetos")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            size={collapsed ? "sm" : "default"}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && <span>Novo Projeto</span>}
          </Button>
        </div>

        {!collapsed && (
          <div className="mb-4 px-2">
            <Button 
              variant="outline"
              className="w-full gap-2 border-border"
              size="default"
            >
              <Search className="h-4 w-4" />
              <span>Buscar</span>
            </Button>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="hover:bg-sidebar-accent/50">
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Configurações</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className={`mt-4 ${collapsed ? "px-0" : "px-2"} flex items-center gap-3`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-accent text-accent-foreground">FS</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Fulano da Silva</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
