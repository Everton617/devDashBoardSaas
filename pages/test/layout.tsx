
const Layout = ({ children, title = 'Next.js App' }) => {
    return (
      <div className="layout">
        
          <title>{title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <main className="content">{children}</main>
        
        <style jsx>{`
          .layout {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          .content {
            flex: 1;
          }
        `}</style>
      </div>
    );
  };
  
  export default Layout;