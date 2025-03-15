

function Navbar() {
  return (
    <div className="flex flex-col h-[12vh]">
    <header className="flex items-center gap-4 border-b bg-white px-10 h-[12vh] ">
      <div className="w-full">
        <form>
          <div className="relative ">
          {/*   <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none h-12 bg-background bg-white shadow-sm pl-12  md:w-2/3 lg:w-1/2"
            /> */}
          </div>
        </form>
      </div>
      <div className="grid grid-cols-8 items-center gap-8 h-22 w-60">
          <div className="col-span-6 flex flex-row gap-4 h-2/3 items-center rounded-xl">
        <img
              src="/logo.jpg"
              alt="Image"
              width={800} 
              height={800}
              className="h-14 w-14 object-cover rounded-full"
            />
            <div className="items-center justify-center h-full text-black flex">ELITE</div>
        </div>
        <div className="col-span-2">
        {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full bg-white shadow-sm">
                <ChevronDown className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    
      
    </header>
    </div>
  )
}

export default Navbar