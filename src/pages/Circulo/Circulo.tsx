import Alertas from '../../components/circulo/Alertas'
import AnalisesDoCirculo from '../../components/circulo/AnalisesDoCirculo'
import Dependentes from '../../components/circulo/Dependentes'
import SeuGuardiao from '../../components/circulo/SeuGuardiao'
import PedirLogin from '../../components/layout/PedirLogin'
import { useSessao } from '../../hooks/useSessao'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

/*
 * Circulo de confianca: o guardiao (quem cuida) e os dependentes (quem e
 * cuidado). Se alguem do circulo analisa algo arriscado, os outros sao avisados.
 * Cada bloco busca os proprios dados, entao um erro em um nao derruba a tela.
 */
export default function Circulo() {
  const { usuario } = useSessao()

  return (
    <main>
      <div className={`${wrap} pt-18 pb-6`}>
        <p className={eyebrow}>Círculo de confiança</p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.4rem,5.4vw,4rem)] font-bold">
          Golpe se combate <span className="hl">em família</span>
        </h1>
        <p className="mt-4.5 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
          O golpista escolhe quem está sozinho. Ligue sua conta à de quem você cuida: quando alguém
          do círculo recebe uma mensagem perigosa, os outros ficam sabendo na hora.
        </p>
      </div>

      <section className="pb-18">
        <div className={`${wrap} grid gap-5`}>
          {!usuario ? (
            <PedirLogin texto="O círculo liga a sua conta à de quem você cuida. Entre para montar o seu." />
          ) : (
            <>
              <Alertas usuarioId={usuario.id} />
              <div className="grid gap-5 md:grid-cols-2">
                <Dependentes usuarioId={usuario.id} />
                <SeuGuardiao usuario={usuario} />
              </div>
              <AnalisesDoCirculo usuarioId={usuario.id} />
            </>
          )}
        </div>
      </section>
    </main>
  )
}
