import React from "react"

const CanvasContext = React.createContext<CanvasRenderingContext2D | null | undefined>(null)

export default CanvasContext
