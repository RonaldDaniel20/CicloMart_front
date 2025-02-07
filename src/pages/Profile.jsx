//-> Componentes
import SideBar from '../components/Profile/PrincipalSections/SideBar.jsx'
import Information from '../components/Profile/PrincipalSections/Information.jsx'
import Settings from '../components/Profile/PrincipalSections/Settings.jsx'

const Profile = () => {
  return (
    <section className="relative flex flex-row h-screen">
      {/* Side Bar */}
      <SideBar />
      {/* Main Content */}
      <div className="flex flex-col w-[80%] h-full">
        {/*General Information*/}
        <Information />

        {/*Settings*/}
        <Settings />
      </div>
    </section>
  )
}
export default Profile
