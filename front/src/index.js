import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/main/index.jsx';
import About from './components/about/index.jsx';
import MacroCat from './components/macroCategories/index.jsx';
import Contacts from './components/contacts/index.jsx';
import App from './components/app/app.jsx';
import Plombir from './components/plombirCategory/index.jsx'
import TabelsMacro from './components/tabelsCategories/index.jsx'
import InDev from './components/INDEV_stub/index.jsx';
import Gerb1 from './components/gerbStufff/gerbGerb/index.jsx';
import Plombirator from './components/plombirStuff/plombirator3000/index.jsx'
import RoundMetal from './components/plombirStuff/roundMetal/index.jsx'
import StampsCat from './components/stampsCat/index.jsx'
import Individ from './components/predprenStuff/individ/index.jsx'
import Ooo from './components/predprenStuff/ooo/index.jsx'
import TabFasadLaser from './components/tabelsStuff/tabelFasadLaser/index.jsx'
import TabOfficeLaser from './components/tabelsStuff/tabelOfficeLaser/index.jsx'
import TabFasad3d from './components/tabelsStuff/tabelFasad3d/index.jsx'
import TabOffice3d from './components/tabelsStuff/tabelOffice3d/index.jsx'
import TabFasadApplication from './components/tabelsStuff/tabelFasadApplication/index.jsx'
import TabOfficeApplication from './components/tabelsStuff/tabelOfficeApplication/index.jsx'
import TabLaserCat from './components/tabelsCategories/tabLaser/index.jsx'
import Tab3dCat from './components/tabelsCategories/tab3D/index.jsx'
import OrderPage from './components/orderForm/index.jsx'
import TabApplicationCat from './components/tabelsCategories/tabApplication/index.jsx'
import GerbDoctor from './components/gerbDoctor/index.jsx'




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<MacroCat />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/cart" element={<App />} />

        <Route path="/stub" element={<InDev />} />

        <Route path="/plombs" element={<Plombir />} />
        <Route path="/tabels" element={<TabelsMacro />} />
        
        <Route path="/gerb1" element={<Gerb1 />} />
        <Route path='/gerbdoctor' element={<GerbDoctor />} />

        <Route path="/plombirator" element={<Plombirator />} />
        <Route path="/roundMetal" element={<RoundMetal />} />

        <Route path="/stampsCat" element={<StampsCat />} />

        <Route path="/individ" element={<Individ />} />
        <Route path="/ooo" element={<Ooo />} />

        <Route path="/tabLaserCat" element={<TabLaserCat />} />
        <Route path="/tab3dCat" element={<Tab3dCat />} />
        <Route path="/tabApplicationCat" element={<TabApplicationCat />} />

        <Route path="/tabFasadLaser" element={<TabFasadLaser />} />
        <Route path="/tabOfficeLaser" element={<TabOfficeLaser />} />
        <Route path="/tabFasad3d" element={<TabFasad3d />} />
        <Route path="/tabOffice3d" element={<TabOffice3d />} />
        <Route path="/tabFasadApplication" element={<TabFasadApplication />} />
        <Route path="/tabOfficeApplication" element={<TabOfficeApplication />} />

        <Route path="/orderPage" element={<OrderPage />} />

      </Routes>
    </Router>
  </React.StrictMode>
);