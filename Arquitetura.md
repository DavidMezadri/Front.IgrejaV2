classDiagram
    direction BT

    class IgrejaV2_API {
        <<Presentation Layer>>
    }
    class IgrejaV2_Aplicacao {
        <<Application Layer>>
    }
    class IgrejaV2_Infraestrutura {
        <<Infrastructure Layer>>
    }
    class IgrejaV2_Dominio {
        <<Core Layer>>
    }

    %% Relacionamentos
    IgrejaV2_Aplicacao --> IgrejaV2_Dominio : Referencia
    IgrejaV2_Infraestrutura --> IgrejaV2_Dominio : Referencia
    IgrejaV2_API --> IgrejaV2_Aplicacao : Referencia
    IgrejaV2_API --> IgrejaV2_Infraestrutura : Referencia (DI/IoC)

    %% Nota explicativa
    note for IgrejaV2_Dominio "Núcleo do sistema\nZero dependências externas"